import express from 'express';
import bodyParser from 'body-parser';
import files_router from './api/files/files_route';

// Essential globals
const app = express();

//  Initialize global application middlewares
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  bodyParser.json({
    type: 'application/json'
  })
);

// Initialize API routing
app.use(files_router);

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

process.on('uncaughtException', (error) => {
  console.log(`Uncaught Exception: ${500} - ${error.message}, Stack: ${error.stack}`);
});
