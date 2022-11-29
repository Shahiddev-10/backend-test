This is the rate limiter project by Shahid Shaikh. 
The limitations are hard coded. You can change the value in seconds in "src/middleware/rateLimiter.ts".
As per requirements, there are 3 endpoints:
1. POST /save
2. GET /load
3. GET /another
The first endpoint is used to save the data in the database. 
The second endpoint is used to load the data from the database. 
Both these endpoint are rate limit protected by middleware.
The third endpoint is not rate limit protected and its to get the number 2.

The tests are written in mocha and chai. These will test simple success cases for all the endpoints.

PROJECT STRUCTURE:
SRC - Development Code
TEST - Unit Tests

INSTALLATION:
To run the project:
npm install
npm run dev

To run the tests:
npm test

NOTE:
The project assumes that you have nodejs and npm installed.
The project also assumes that you have redis installed and running on port 6379.