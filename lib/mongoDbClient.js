const mongoMod = require('./mongoHelper');
const logger = require('./logger');
const db = new mongoMod.mongoDbClient();

function connectDatabase(connection, onSuccess, onFailure) {
  try {
    db.connect(connection, onSuccess, onFailure);
  }
  catch(ex) {
    logger.error("Error caught,", ex);
    onFailure(ex);
  }
}

module.exports = {
  connectDatabase: connectDatabase,
  db: db
};
