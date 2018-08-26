const express = require("express");
const router = express.Router();
const inspectionCtrlr = require('./inspection.controller');
const {verifyToken} = require('../../middlewares/authMiddleware');

router.post('/', inspectionCtrlr.addNewInspection);
router.get('/', inspectionCtrlr.filterInspections);

module.exports = router;
