const venues = {
  '1': "Home",
  '2': "Office",
  '3': "Vehicle"
};

var {serverError, clientError, success} = require('../../middlewares/basicResHandler')
var {isValidLatLong} = require('../../utils/geoHelper');
var {db} = require('../../lib/mongoDbClient');
var logger = require('../../lib/logger');

function addNewInspection(req, res){
  try{
    var body = req.body || {};
    if(Object.keys(venues).indexOf(body.venueTypeId.toString()) === -1){
      return clientError(res, 'Please provide a valid venueTypeId!');
    }

    if(!isValidLatLong(body.location[0], body.location[1])){
      return clientError(res, `Please provide a lat long details: [${body.lat}, ${body.long}]`);
    }

    var inspectionData = {
      inspectorId: req.tkn.id,
      curStatus: 1,
      lastUpdatedTS: Date.now(),
      entryTS: Date.now(),
      venueTypeId: body.venueTypeId,
      location: [
        body.location[1], body.location[0]
      ]
    };

    db.insertDocumentWithIndex('inspections', inspectionData, function(e, d) {
      if(e){
        serverError(res, e);
      }
      else{
        if(d.result.ok)
          success(res, {msg: `Added new Inspection successfully`});
        else{
          serverError(res, 'Success, but no record was inserted');
        }
      }
    });

  }
  catch(e){
    serverError(res, e);
  }
}

function filterInspections(req, res){
  try{
    var qs = req.query || {};
    var dbQuery = {'$and': []};

    if(qs.fr > 0){
      dbQuery['$and'].push({entryTS: {$gte: parseInt(qs.fr)}});
    }

    if(qs.to > 0){
      dbQuery['$and'].push({entryTS: {$lte: parseInt(qs.to)}});
    }

    if(qs.vt > 0){
      dbQuery['$and'].push({venueTypeId: parseInt(qs.vt)});
    }

    if(qs.curSt > 0){
      dbQuery['$and'].push({curStatus: parseInt(qs.curSt)});
    }

    if(qs.closeTo){
      var points = (qs.closeTo || "").split(',');
      if(points.length !== 2){
        return clientError(res, 'Please specify a valid param value for closeTo, like closeTo=lat,long');
      }

      points[0] = parseInt(points[0]);
      points[1] = parseInt(points[1]);

      if(!isValidLatLong(points[0], points[1])){
        return clientError(res, 'Please specify a valid lat long values');
      }
      dbQuery['$and'].push({location : {$near: [points[1], points[0]], $maxDistance: 0.10}});
    }

    if(!dbQuery['$and'].length)
      dbQuery['$and'] = [{}];

    var aggQuery = [
      {$match: dbQuery},
      {
        $lookup: {
          from: 'inspectionStatusMaster',
          localField: 'curStatus',
          foreignField: 'idx',
          as: "inspectionStatus"
        },
      },
      {$unwind: '$inspectionStatus'},
      {
        $lookup: {
          from: 'inspectors',
          localField: 'inspectorId',
          foreignField: 'idx',
          as: "inspectors"
        },
      },
      {$unwind: '$inspectors'},
      {
        $lookup: {
          from: 'venues',
          localField: 'venueTypeId',
          foreignField: 'idx',
          as: "venues"
        },
      },
      {$unwind: '$venues'},
      {   
        $project:{
          _id : 0,
          lastUpdatedTS: 1,
          entryTS: 1,
          location: 1,
          idx: 1,
          inspectorNm: "$inspectors.nm",
          currStatus: "$inspectionStatus.nm",
          venueType: "$venues.nm",
        }
      },
      {$limit: qs.lmt || 20},
      {$sort : {entryTS : -1}}
    ];
    
    if(qs.offset > 0)
      aggQuery.push({$skip: qs.offset});

    db.getDocumentCountByQuery('inspections', dbQuery, (err, totalCount) => {
      if(err) return serverError(res, err);
      db.findDocByAggregation('inspections', aggQuery, (e, d) => {
        if(e) return serverError(res, e);
        // d['totalCount'] = totalCount;
        success(res, {d, totalCount});
      });
    });
  }
  catch(e){
    serverError(res, e);
  }
}

module.exports = {
  addNewInspection: addNewInspection,
  filterInspections: filterInspections
}
