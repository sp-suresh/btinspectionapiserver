use test;

db.createCollection('counters');

//Creating Counter Collections
print('Initialising counters');
db.counters.insert({_id: 'inspections', seq: 0});
db.counters.insert({_id: 'inspectors', seq: 0});
db.counters.insert({_id: 'venues', seq: 0});
db.counters.insert({_id: 'inspectionStatusMaster', seq: 0});

db.inspections.createIndex( { 'idx': 1 }, { unique: true } );
db.inspectors.createIndex( { 'idx': 1 }, { unique: true } );
db.venues.createIndex( { 'idx': 1 }, { unique: true } );
db.inspectionStatusMaster.createIndex( { 'idx': 1 }, { unique: true } );

db.inspections.ensureIndex({ "location": "2d" });

// inspection status master
print('Inserting inspectionStatusMaster');
db.inspectionStatusMaster.insertMany([
  {
    "idx": 1,
    "nm": "Started"
  },
  {
    "idx": 2,
    "nm": "Pending"
  },
  {
    "idx": 3,
    "nm": "Approved"
  },
  {
    "idx": 4,
    "nm": "Rejected"
  }
]);

// Possible inspection venues
print('Inserting venues');
db.venues.insertMany([
  {
    "idx": 1,
    "nm": "Home"
  },
  {
    "idx": 2,
    "nm": "Office"
  },
  {
    "idx": 3,
    "nm": "Vehicle"
  }
]);

// Sample inspectors
print('Instering inspectors');
db.inspectors.insertMany([
  {
    "idx": 1,
    "nm": "Ramesh",
    "mob": "9869547580"
  },
  {
    "idx": 2,
    "nm": "Suresh",
    "mob": "9004794642"
  },
  {
    "idx": 3,
    "nm": "Kamesh",
    "mob": "9969387555"
  }
]);

// Sample collection data for inspections
// print('Inserting inspections')
// db.inspections.insertMany([
//   {
//   "idx": 1,
//   "inspectorId": 1,
//   "curStatus": 1,
//   "lastUpdatedTS": 1535191409371,
//   "entryTS": 1535191409371,
//   "venueType": 1,
//   "location": [
//        -122.0446183,
//        47.5891279
//     ]
//   },
//   {
//     "idx": 2,
//     "inspectorId": 1,
//     "curStatus": 2,
//     "lastUpdatedTS": 1535191309371,
//     "entryTS": 1535191309371,
//     "venueType": 2,
//     "location": [
//          -121.0446183,
//          46.5891279
//       ]
//   },
//   {
//     "idx": 3,
//     "inspectorId": 2,
//     "curStatus": 2,
//     "lastUpdatedTS": 1535191209371,
//     "entryTS": 1535191209371,
//     "venueType": 3,
//     "location": [
//          -120.0446183,
//          45.5891279
//       ]
//   },
//   {
//     "idx": 4,
//     "inspectorId": 3,
//     "curStatus": 3,
//     "lastUpdatedTS": 1535191109371,
//     "entryTS": 1535191109371,
//     "venueType": 2,
//     "location": [
//          -132.0446183,
//          57.5891279
//       ]
//   },
//   {
//     "idx": 5,
//     "inspectorId": 2,
//     "curStatus": 4,
//     "lastUpdatedTS": 1535191009371,
//     "entryTS": 1535191009371,
//     "venueType": 1,
//     "location": [
//          -22.0446183,
//          17.5891279
//       ]
//   }]
// );


db.counters.find().pretty();

print('db.inspections.find().pretty();');
db.inspections.find().pretty();

print('db.inspectors.find().pretty();');
db.inspectors.find().pretty();

print('db.venues.find().pretty();');
db.venues.find().pretty();

print('db.inspectionStatusMaster.find().pretty();');
db.inspectionStatusMaster.find().pretty();
