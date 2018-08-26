var mongoClient = require("mongodb").MongoClient,
  db;
var logger = require('./logger');

function isObject(obj) {
  return Object.keys(obj).length > 0 && obj.constructor === Object;
}

class mongoDbClient {
  connect(conn, onSuccess, onFailure){
    try {
      mongoClient.connect(conn, { useNewUrlParser: true }, (err, database) => {
        if(err){
          this.db = null;
          logger.error("MongoClient Connection failed.");
          onFailure();
          return;
        }
        else {
          this.db = database.db('test');;
          logger.info("MongoClient Connection successfull.");
          onSuccess();
          return;
        }
      });
    }
    catch(ex) {
      logger.error("Error caught,", ex);
      onFailure(ex);
    }
  }

  getNextSequence(coll, cb) {
    this.db.collection("counters").findOneAndUpdate({
        _id: coll
      },
      {$inc: {seq: 1}},
      {projections: {seq: 1},
        upsert: true,
        returnOriginal: false
      },
      cb
    );
  }

  insertDocumentWithIndex(coll, doc, cb) {
    try {
      if(!isObject(doc)){
        throw Error("mongoClient.insertDocumentWithIndex: document is not an object");
        return;
      }

      var doc2 = JSON.parse(JSON.stringify(doc));
      this.getNextSequence(coll, (err, index) => {
        if(err) {
          logger.error("mongoClient.insertDocumentWithIndex: could not get the seq number,", err);
          cb(err, index);
        } else {
          logger.debug(index);
          doc2.idx = index.value.seq;
          this.db.collection(coll).insertOne(doc2, (err, data) => {
            if(err) logger.error("mongoClient.insertDocumentWithIndex: error inserting the document.", err);
            else logger.info("mongoClient.insertDocumentWithIndex: inserted one document");
            cb(err, data);
          });
        }
      });
    }
    catch(e) {
      logger.error("mongoClient.insertDocumentWithIndex: Error caught,", e);
      cb(e, null);
    }
  }

  findDocFieldsByFilter(coll, query, projection, lmt, cb) {
    if(!query){
      throw Error("mongoClient.findDocFieldsByFilter: query is not an object");
    }
    try {
      this.db.collection(coll).find(query, projection, {
        limit: lmt || 0
      }).toArray(function(err, item) {
        if(err) logger.error("mongoClient.findDocFieldsByFilter: error in checking document existence", err);
        cb(err, item);
      });
    }
    catch(e) {
      logger.error("mongoClient.findDocFieldsByFilter: Error caught,", e);
      cb(e, null);
    }
  }

  // FindDocsByOptions(coll, query, projection, options, cb) {
  //   if(!query || !projection || !options){
  //     throw Error("mongoClient.FindDocsByOptions: inavlid args");
  //   }
  //   try {
  //     this.db.collection(coll).find(query, projection, options).toArray(function(err, item) {
  //       if(err) logger.error("mongoClient.FindDocsByOptions: error in checking document existence", err);
  //       cb(err, item);
  //     });
  //   }
  //   catch(e) {
  //     logger.error("mongoClient.FindDocsByOptions: Error caught,", e);
  //     cb(e, null);
  //   }
  // }

  findDocByAggregation(coll, query, cb) {
    if(!query.length){
      throw Error("mongoClient.findDocByAggregation: query is not an object");
    }
    try {
      this.db.collection(coll).aggregate(query).toArray(function(err, doc) {
        if(err)
          logger.error("mongoClient.findDocByAggregation: query", query, ", err", err);
        else
          logger.info("mongoClient.findDocByAggregation: Aggregation successfull.");
        cb(err, doc);
      });
    }
    catch(e) {
      logger.error("mongoClient.findDocByAggregation: Error caught,", e);
      cb(e, null);
    }
  }

  getDocumentCountByQuery(coll, query, cb) {
    if(!isObject(query)){
      throw Error("mongoClient.getDocumentCountByQuery: query is not an object");
    }
    try {
      this.db.collection(coll).count(query, function(err, data) {
        if(err) logger.error("mongoClient.getDocumentCountByQuery: error counting the document with query,", err);
        else logger.info("mongoClient.getDocumentCountByQuery: counting successfull");
        cb(err, data);
      });
    }
    catch(e) {
      logger.error("mongoClient.getDocumentCountByQuery: Error caught,", e);
      cb(e, null);
    }
  }

  findOneAndUpdate(coll, values, query, option, cb) {
    if(!(IsObject(values) && IsObject(query) && option)){
      throw Error("mongoClient.UpdateDocument: values, query and option should be an object");
    }
    try {
      this.db.collection(coll).findOneAndUpdate(query, {$set : values}, option, function(err, result) {
        if(err)
          logger.error("mongoClient.UpdateDocument: error updating the document with values", err);
        else
          logger.info("mongoClient.UpdateDocument: update successfull");
        cb(err, result);
      });
    }
    catch(e) {
      logger.error("mongoClient.UpdateDocument: Error caught,", e);
      cb(e, null);
    }
  }

  // UpdateDocumentArr(coll, values, query, cb) {
  //   if(!(IsObject(values) && IsObject(query))){
  //     throw Error("mongoClient.UpdateDocumentArr: values and query should be an object");
  //   }
  //   try {
  //     this.db.collection(coll).updateMany(query, {
  //       $set: values
  //     }, function(err, result) {
  //       if(err)
  //         logger.error("mongoClient.UpdateDocumentArr: error updating the document with values,", err);
  //       else
  //         logger.info("mongoClient.UpdateDocumentArr: update successfull");
  //       cb(err, result);
  //     });
  //   }
  //   catch(e) {
  //     logger.error("mongoClient.UpdateDocumentArr: Error caught,", e);
  //     cb(e, null);
  //   }
  // }

  modifyOneDocument(coll, values, query, option, cb) {
    if(!(IsObject(values) && IsObject(query) && option)){
      throw Error("mongoClient.ModifyOneDocument: values, query and option should be an object");
    }
    try {
      this.db.collection(coll).updateOne(query, values, option, function(err, result) {
        if(err)
          logger.error("mongoClient.ModifyOneDocument: error updating the document with values", err);
        else
          logger.info("mongoClient.ModifyOneDocument: update successfull");
        cb(err, result);
      });
    }
    catch(e) {
      logger.error("mongoClient.ModifyOneDocument: Error caught,", e);
      cb(e, null);
    }
  }

//   DeleteOneDocument(coll, query, cb) {
//     if(!IsObject(query)){
//       throw Error("mongoClient.DeleteOneDocument: query should be an object");
//     }
//     try{
//       this.db.collection(coll).updateOne(query, { $set : { deleted: true } }, function(err, result) {
//         if(err)
//           logger.error("mongoClient.DeleteOneDocument: Error deleting the document", err);
//         else
//           logger.info("mongoClient.DeleteOneDocument: Delete successfull");
//         cb(err, result);
//       });
//     }
//     catch(e) {
//       logger.error("mongoClient.DeleteOneDocument: Error caught,", e);
//       cb(e, null);
//     }
//   }

//   DeleteManyDocuments(coll, query, cb) {
//     if(!IsObject(query)){
//       throw Error("mongoClient.DeleteManyDocuments: query should be an object");
//     }
//     try{
//       this.db.collection(coll).updateMany(query, { $set : { deleted: true } }, function(err, result) {
//         if(err)
//           logger.error("mongoClient.DeleteManyDocuments: Error deleting the documents", err);
//         else
//           logger.info("mongoClient.DeleteManyDocuments: Deletes successfull");
//         cb(err, result);
//       });
//     }
//     catch(e) {
//       logger.error("mongoClient.DeleteManyDocuments: Error caught,", e);
//       cb(e, null);
//     }
//   }

//   PermanetlyDeleteDocument(coll, query, cb) {
//     if(!IsObject(query)){
//       throw Error("mongoClient.PermanetlyDeleteDocument: query should be an object");
//     }
//     try {
//       this.db.collection(coll).deleteOne(query, function(err, result) {
//         if(err)
//           logger.error("mongoClient.PermanetlyDeleteDocument: error deleting the document with values,", err);
//         else
//           logger.info("mongoClient.PermanetlyDeleteDocument: delete successfull");
//         cb(err, result);
//       });
//     }
//     catch(e) {
//       logger.error("mongoClient.PermanetlyDeleteDocument: Error caught,", e);
//       cb(e, null);
//     }
//   }

//   PermanetlyDeleteManyDocument(coll, query, cb) {
//     if(!IsObject(query)){
//       throw Error("mongoClient.PermanetlyDeleteDocument: query should be an object");
//     }
//     try {
//       this.db.collection(coll).deleteMany(query, function(err, result) {
//         if(err)
//           logger.error("mongoClient.PermanetlyDeleteDocument: error deleting the document with values,", err);
//         else
//           logger.info("mongoClient.PermanetlyDeleteDocument: delete successfull");
//         cb(err, result);
//       });
//     }
//     catch(e) {
//       logger.error("mongoClient.PermanetlyDeleteDocument: Error caught,", e);
//       cb(e, null);
//     }
//   }

//   ArchiveAndDelete(coll, query, cb) {
//     var self = this;
//     try{
//       if(!IsObject(query)){
//         throw Error("mongoClient.DeleteOneDocument: query should be an object");
//         return;
//       }

//       this.db.collection(coll).findOne(query, function(err, result) {
//         if(err){
//           logger.error("mongoClient.DeleteOneDocument: error finding the document with values,", err);
//           cb(err, result);
//         }
//         else{
//           logger.info("mongoClient.DeleteOneDocument: find successfull");
//           self.db.collection("archived" + coll).insertOne(result, function(err, result) {
//             if(err){
//               logger.error("mongoClient.DeleteOneDocument: error inserting the document with values,", err);
//               cb(err, result);
//             }
//             else{
//               logger.info("mongoClient.DeleteOneDocument: insert successfull");
//               self.db.collection(coll).deleteOne(query, function(err, result) {
//                 if(err)
//                   logger.error("mongoClient.DeleteOneDocument: error deleting the document with values,", err);
//                 else
//                   logger.info("mongoClient.DeleteOneDocument: delete successfull");
//                 cb(err, result);
//               });
//             }
//           });
//         }
//       });
//     }
//     catch(e) {
//       logger.error("mongoClient.DeleteOneDocument: Error caught,", e);
//       cb(e, null);
//     }
//   }

//   GetDocumentCursorFieldsByQuery(coll, query, projection, lmt, skip, cb){
//     try{
//       if(query.constructor !== Object){
//         throw Error('GetDocumentCursor - query type is not valid: ', query);
//         return;
//       }
//       if(projection.constructor !== Object){
//         throw Error('GetDocumentCursor - projection type is not valid: ', projection);
//         return;
//       }
//       if(!coll){
//         throw Error('GetDocumentCursor - Collection name is not valid: ', coll);
//         return;
//       }
//       var cursor = this.db.collection(coll).find(query).project(projection);
//       if(skip)
//         cursor = cursor.skip(skip);
//       if(lmt)
//         cursor = cursor.limit(lmt);
//       cb(null, cursor);
//     }
//     catch(e){
//       logger.error("mongoClient.GetDocumentCursorFieldsByQuery: Error caught,", e);
//       cb(e);
//     }
//   }
}

module.exports = {
  mongoDbClient: mongoDbClient
}
