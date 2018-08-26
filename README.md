# Basic Inspection REST APIs
This is submission of my code test for one of my interview, where I was required to create some RESTful APIs.

## Pre Setup Required

1. MongoDB
2. NodeJS

After you have install MongoDB create some collection and indexes required to run application using below command. You should go through it once before you run it.

`mongo < ./scripts/mongoCollSetup.js`

## API Documentaions

1. To create a new Inspection

`Url: /api/inspection/`
`Method: POST`
`Hedaer: jwtToken`
`Request Body: {`
`  "curStatus": 1,`
`  "lastUpdatedTS": 1535191409371,`
`  "entryTS": 1535191409371,`
`  "venueTypeId": 1,`
`  "location": [`
`       -45.0446183,`
`       45.5891279`
`	]`
`}`
Response Body: 
`{msg: Added new Inspection successfully}`
The record will be created against loggedin inspector. On successful inspection addition API will return message - "Added new Inspection successfully"

2. To filter the inspections

`
Url: /api/inspection/?curSt=1&fr=1535222623216&to=1535222723216&vt=1&lmt=20&offset=10
Method: GET
Header: jwtToken
Response Body:
{
    "d": [
        {
            "lastUpdatedTS": 1535294118117,
            "entryTS": 1535294118117,
            "location": [
                55.5891279,
                -55.0446183
            ],
            "idx": 2,
            "inspectorNm": "Ramesh",
            "currStatus": "Started",
            "venueType": "Office"
        },
        {
            "lastUpdatedTS": 1535222623216,
            "entryTS": 1535222623216,
            "location": [
                45.5891279,
                -45.0446183
            ],
            "idx": 1,
            "inspectorNm": "Ramesh",
            "currStatus": "Started",
            "venueType": "Home"
        }
    ],
    "totalCount": 2
}
`

Query string parameters are optional, below is the param description

`
curSt: Current status of the inspection
fr: inspection added after(inclusive),
to: inspection till date(inclusive),
vt: venur type
lmt: limit to number of records
offset: skip number of records
`
Read data in collections `inspectionStatusMaster` and `venues` to get the maaping for venue type and inspection status

##Note

1.Both the API require jwt token in header key `tkn` which is obtained over secret `$GHVG^&BVY@#$VB`. You can change it in `./middlewares/authMiddleware.js` if you want.
2. To start the server run `node server.js` and application will start listening at port `9090`.
3. Mongo database name is - `test`