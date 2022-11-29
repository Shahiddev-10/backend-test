// files routes
// ./src/route/files_route.ts

import express from 'express';
import { files_controller } from './files_controller';
import { customRedisRateLimiter } from '../../middlewares/rateLimiter';

let files_router = express.Router();

files_router.post('/save', customRedisRateLimiter, (req: express.Request, res: express.Response) => {
  new files_controller().save(req.body).then((result) => {
    res.status(result.status).json(result.data);
  });
});

files_router.get('/load', customRedisRateLimiter, (req: express.Request, res: express.Response) => {
  new files_controller().load().then((result) => {
    res.status(result.status).json(result.data);
  });
});

files_router.get('/another', (req: express.Request, res: express.Response) => {
  new files_controller().another().then((result) => {
    res.status(result.status).json(result.data);
  });
});

export = files_router;
