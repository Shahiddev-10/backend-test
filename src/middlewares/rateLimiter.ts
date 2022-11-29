import express from 'express';
import moment from 'moment';
import * as redis from 'redis';

const client = redis.createClient({
  socket: {
    host: 'localhost',
    port: 6379
  }
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_WINDOW_REQUEST_COUNT = 10;
const WINDOW_LOG_INTERVAL_IN_SECONDS = 1;

export const customRedisRateLimiter = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    if (!client) {
      throw new Error('Redis client does not exist!');
      process.exit(1);
    }
    // fetch records of current user using IP address, returns null when no record is found
    const record = await client.get(req.ip).catch((err) => {
      throw new Error(err);
    });

    const currentRequestTime = moment();

    //  if no record is found , create a new record for user and store to redis
    if (record == null) {
      let newRecord = [];
      let requestLog = {
        requestTimeStamp: currentRequestTime.unix(),
        requestCount: 1
      };
      newRecord.push(requestLog);
      client.set(req.ip, JSON.stringify(newRecord));
      next();
      // if record is found, parse it's value and calculate number of requests users has made wirhin the last window
    } else {
      let data = JSON.parse(record);
      let windowStartTimestamp = moment().subtract(WINDOW_SIZE_IN_SECONDS, 'seconds').unix();
      let requestsWithinWindow = data.filter((entry: any) => {
        return entry.requestTimeStamp > windowStartTimestamp;
      });
      let totalWindowRequestsCount = requestsWithinWindow.reduce((accumulator: any, entry: any) => {
        return accumulator + entry.requestCount;
      }, 0);
      // if number of requests made is greater than or equal to the desired maximum, return error
      if (totalWindowRequestsCount >= MAX_WINDOW_REQUEST_COUNT) {
        res
          .status(429)
          .json(
            `You have exceeded the ${MAX_WINDOW_REQUEST_COUNT} requests in ${WINDOW_SIZE_IN_SECONDS} seconds limit!`
          );
      } else {
        // if number of requests made is lesser than allowed maximum, log new entry
        let lastRequestLog = data[data.length - 1];
        let potentialCurrentWindowIntervalStartTimeStamp = currentRequestTime
          .subtract(WINDOW_LOG_INTERVAL_IN_SECONDS, 'seconds')
          .unix();

        //  if interval has not passed since last request log, increment counter
        if (lastRequestLog.requestTimeStamp > potentialCurrentWindowIntervalStartTimeStamp) {
          lastRequestLog.requestCount++;
          data[data.length - 1] = lastRequestLog;
        } else {
          //  if interval has passed, log new entry for current user and timestamp
          data.push({
            requestTimeStamp: currentRequestTime.unix(),
            requestCount: 1
          });
        }
        client.set(req.ip, JSON.stringify(data));
        next();
      }
    }
  } catch (error) {
    next(error);
  }
};
