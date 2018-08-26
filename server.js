const PORT = 9090;
const logger = require('./lib/logger');

logger.info(`Starting Blue Tie Inspection API Server on port ${PORT}...`);

const express = require("express");
const router = express.Router();
const app = express();

const {inputBodyBuffer} = require('./middlewares/bodyParser');

const {connectDatabase} = require('./lib/mongoDbClient');

logger.info('Connecting to MongoDB...');

connectDatabase('mongodb://localhost:27017', function() {
  app.use(inputBodyBuffer);
  
  router.use('/inspection', require('./controllers/inspection'));
  
  app.use('/api', router);

  app.listen(PORT, (e) => {
    if(e){
      logger.error('Error starting application', e)
      process.exit();
    }
    else{
      logger.info(`Application started on port: ${PORT}`);
    }
  })
}, function(e){
  logger.error('Error in connecting to MongoDB', e);
  process.exit()
});
