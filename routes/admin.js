var path = require('path');
var root_path = path.dirname(require.main.filename);
var models = require(root_path + '/models');
const express = require('express');
var router = express.Router();
var fs = require('fs');
const multer = require('multer');
var pdfreader = require('pdfreader');
var constant = require(root_path + '/config/constant');
var moment = require('moment');
var models = require("../models");
var urlencode = require('urlencode');
var request = require('request');
var converter = require('number-to-words');
var sequelize = require("sequelize");
const Op = sequelize.Op;
var functions = require('./functions');
const e = require('express');
const { pattern } = require('pdfkit');
const { log } = require('console');

router.post('/updateOtp', async (req, res) => {
    console.log('/updateOtp');

    var user_id = req.body.user_id;
    var otp = req.body.otp;

    var updateUser = await functions.getUserDetails(user_id, otp);

    if (updateUser.length > 0) {
        res.json({
            status: 200,
            message: "OTP Verified Successfully!"
        })
    } else {
        res.json({
            status: 400,
            message: type + "Invalid OTP"
        })
    }

})

router.post('/updateCollegeFaculty', async (req, res) => {
    console.log('/updateCollegeFaculty');

    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    var app_id = req.body.app_id;
    var id = req.body.id;
    var type = req.body.type;
    var function_type = req.body.function_type;
    var formData = req.body.formData;
    var purpose = req.body.purpose;

    //for college add & edit
    if (purpose == 'College') {
        if (function_type == 'add') {
            var addCollege = await functions.getAddCollege(type, formData);
            console.log('------------------------------>', addCollege);

            if (addCollege) {
                var createActivityTrackerAdd = await functions.getCreateActivityTrackerAdd(user_id, user_name, addCollege.name, app_id);

                return res.json({
                    status: 200,
                    message: 'College Added Successfully!'
                });
            } else {
                return res.json({
                    status: 400,
                    message: 'Failed to Add College'
                });
            }
        } else {
            var updatedCollegeName = formData.collegeName;

            var updateCollege = await functions.getUpdateCollege(type, formData, id);
            console.log('updateCollege', updateCollege);

            if (updateCollege) {
                var createActivityTrackerUpdate = await functions.getCreateActivityTrackerUpdate(user_id, user_name, updatedCollegeName, app_id);

                return res.json({
                    status: 200,
                    message: 'College Updated Successfully!'
                });
            } else {
                return res.json({
                    status: 400,
                    message: 'Failed to Update College'
                });
            }
        }
    } else {//for faculty add & edit
        if (function_type == 'add') {
            var addFaculty = await functions.getAddFaculty(formData);

            var addedFacultyName = addFaculty.degree + ' of ' + addFaculty.faculty;

            if (addFaculty) {
                var createActivityTrackerAdd = await functions.getCreateActivityTrackerAdd(user_id, user_name, addedFacultyName, app_id);

                return res.json({
                    status: 200,
                    message: 'College Added Successfully!'
                });
            } else {
                return res.json({
                    status: 400,
                    message: 'Failed to Add College'
                });
            }
        } else {
            var updateFaculty = await functions.getUpdateFaculty(formData, id);

            var updatedFacultyName = formData.degreeName + ' of ' + formData.facultyName;

            if (updateFaculty) {
                var createActivityTrackerUpdate = await functions.getCreateActivityTrackerUpdate(user_id, user_name, updatedFacultyName, app_id);

                return res.json({
                    status: 200,
                    message: 'College Updated Successfully!'
                });
            } else {
                return res.json({
                    status: 400,
                    message: 'Failed to Update College'
                });
            }
        }
    }
})

router.get('/getCollegeList', async (req, res) => {
    console.log('/getCollegeList');

    var id = req.query.id;
    console.log('clg id', id);

    if (id == 'null') {
        console.log('inside null');
        var collegeDetails = await functions.getAllCollegeList()
        console.log('collegeDetails', collegeDetails.length);

        if (collegeDetails.length > 0) {
            return res.json({
                status: 200,
                data: collegeDetails,
            });
        } else {
            return res.json({
                status: 400,
            });
        }
    } else {
        var collegeDetails = await functions.getSingleCollegeList(id)
        console.log('collegeDetails', collegeDetails.length);

        if (collegeDetails.length > 0) {
            return res.json({
                status: 200,
                data: collegeDetails,
            });
        } else {
            return res.json({
                status: 400,
            });
        }
    }
})

router.get('/getFacultyList', async (req, res) => {
    console.log('/getFacultyList');

    var id = req.query.id;
    console.log('fac id', id);

    if (id == 'null') {
        var facultyDetails = await functions.getAllFacultyList()
        console.log('facultyDetails', facultyDetails.length);

        if (facultyDetails.length > 0) {
            return res.json({
                status: 200,
                data: facultyDetails,
            });
        } else {
            return res.json({
                status: 400,
            });
        }
    } else {
        var facultyDetails = await functions.getSingleFacultyList(id)
        console.log('facultyDetails', facultyDetails.length);

        if (facultyDetails.length > 0) {
            return res.json({
                status: 200,
                data: facultyDetails,
            });
        } else {
            return res.json({
                status: 400,
            });
        }
    }
})

router.post('/deleteCollegeFaculty', async (req, res) => {
    console.log('/deleteCollegeFaculty');

    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    var app_id = req.body.app_id;
    var purpose = req.body.purpose;
    var id = req.body.dataCollegeFaculty.id;
    console.log('************', req.body.dataCollegeFaculty);

    if (purpose == 'College') {
        var college_name = req.body.dataCollegeFaculty.name;

        var deleteCollge = await functions.getDeleteCollege(id);

        if (deleteCollge == 1) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, college_name, app_id);

            return res.json({
                status: 200,
                message: 'College Deleted Successfully!'
            });
        } else {
            return res.json({
                status: 400,
                message: 'Failed to Delete College'
            });
        }
    } else {
        var faculty_name = req.body.dataCollegeFaculty.degree + ' of ' + req.body.dataCollegeFaculty.faculty;

        var deleteFaculty = await functions.getDeleteFaculty(id);

        if (deleteFaculty == 1) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, faculty_name, app_id);

            return res.json({
                status: 200,
                message: 'Faculty Deleted Successfully!'
            });
        } else {
            return res.json({
                status: 400,
                message: 'Failed to Delete Faculty'
            });
        }
    }

})

router.post('/activeinactiveCollege', async (req, res) => {
    console.log('/activeinactiveCollege', req.body.collegeData);

    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    console.log('user_name', user_name);
    var app_id = req.body.app_id;
    var event = req.body.event;
    var id = req.body.collegeData.id;
    console.log('id', id);
    var college_name = req.body.collegeData.name;
    console.log('college_name', college_name);
    var status;

    if (event == true) {
        status = 'active';
    } else {
        status = 'inactive';
    }

    var activeinactive = await functions.getActiveInactiveCollege(status, id);
    console.log('activeinactive', activeinactive);
    console.log('activeinactive', activeinactive.length);

    if (activeinactive.length > 0) {
        var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, college_name, status, app_id);

        return res.json({
            status: 200,
            message: 'College ' + status + ' successfully!',
            data: status
        });
    } else {
        return res.json({
            status: 400,
            message: 'Failed to get ' + status
        });
    }

})

router.get('/getActivityTrackerList', async (req, res) => {
    console.log('/getActivityTrackerList');

    var trackerList = await functions.getActivityTrackerList();

    if (trackerList.length > 0) {
        return res.json({
            status: 200,
            data: trackerList,
        });
    } else {
        return res.json({
            status: 400,
        });
    }
})

module.exports = router;
