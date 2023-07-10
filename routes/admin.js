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
var json2xls = require('json2xls');


router.post('/updateOtp', async (req, res) => {
    console.log('/updateOtp');

    var user_id = req.body.user_id;
    console.log('%%%%%%%%%%%%%', user_id);
    var otp = req.body.otp;
    console.log('#############', otp);

    var updateUser = await functions.getUserDetails(user_id, otp);

    if (updateUser.length > 0) {
        res.json({
            status: 200,
            message: "OTP Verified Successfully!"
        })
    } else {
        res.json({
            status: 400,
            message: "Invalid OTP"
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
    console.log('/activeinactiveCollege', req.body.dataCollegeFaculty);

    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    console.log('user_name', user_name);
    var app_id = req.body.app_id;
    var event = req.body.event;
    var id = req.body.dataCollegeFaculty.id;
    console.log('id', id);
    var college_name = req.body.dataCollegeFaculty.name;
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
            message: 'Failed to get ' + status,
        });
    }

})

router.get('/getActivityTrackerList', async (req, res) => {
    console.log('/getActivityTrackerList');

    var student_id = req.query.student_id;
    console.log('888888888888888888', student_id);

    if (student_id == '' || student_id == null || student_id == undefined) {
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
    } else {
        var trackerList = await functions.getActivityTrackerSingle(student_id);

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
    }


})

router.get('/getStudentList', async (req, res) => {
    console.log('/getStudentList');

    var student_id = req.query.id;
    console.log('-----', student_id);

    models.User.getStudentManagment(student_id).then(student => {
        if (student.length > 0) {
            return res.json({
                status: 200,
                data: student,
            });
        } else {
            return res.json({
                status: 400,
            });
        }
    })
})

router.post('/activeinactiveUser', async (req, res) => {
    console.log('/activeinactiveUser');

    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    var event = req.body.event;
    var status;
    var student_id = req.body.studentData.id;
    var student_app_id = req.body.studentData.app_id;
    var student_name = req.body.studentData.name + ' ' + req.body.studentData.surname;

    if (event == true) {
        status = 'active';
    } else {
        status = 'inactive';
    }

    var activeinactive = await functions.getActiveInactiveStudent(status, student_id);

    if (activeinactive.length > 0) {
        var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, student_name, status, student_app_id);
        return res.json({
            status: 200,
            message: student_name + ' ' + status + ' successfully!',
            data: status
        });
    } else {
        return res.json({
            status: 400,
            message: 'Failed to ' + status + student_name,
        });
    }
})

router.post('/resetPasswordByAdmin', async (req, res) => {
    console.log('/resetPasswordByAdmin');

    var student_id = req.body.studentData.id;
    var student_app_id = req.body.studentData.app_id;
    var student_name = req.body.studentData.name + ' ' + req.body.studentData.surname;
    var password = '123456';
    var hashPassword;
    var user_id = req.body.user_id;
    var user_name = req.body.user_name;

    if (password == '123456') {
        hashPassword = functions.generateHashPassword(password);

        var resetPassword = await functions.getResetPassword(hashPassword, student_id);

        if (resetPassword == 1) {
            var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, student_name, 'reset password', student_app_id);
            return res.json({
                status: 200,
                message: 'Password reset successfully to 123456',
            });
        } else {
            return res.json({
                status: 400,
                message: 'Failed to reset password',
            });
        }
    } else {
        return res.json({
            status: 400,
            message: 'Something went wrong while changing your Password',
        });
    }
})

router.post('/resetDocumentByAdmin', async (req, res) => {
    console.log('/resetDocumentByAdmin');

    var student_id = req.body.studentData.id;
    var student_app_id = req.body.studentData.app_id;
    var student_name = req.body.studentData.name + ' ' + req.body.studentData.surname;
    var user_id = req.body.user_id;
    var user_name = req.body.user_name;

    var applicationDetails = await functions.getApplicationDetails(student_id);

    if (applicationDetails == null || applicationDetails == 'null') {
        models.Applied_For_Details.deleteUserData(student_id).then(function (appliedDetails) {
            models.UserMarklist_Upload.deleteUserData(student_id).then(function (userMark_Upload) {
                models.User_Transcript.deleteUserData(student_id).then(function (UserTranscript) {
                    models.User_Curriculum.deleteUserData(student_id).then(function (userCurri) {
                        models.InstructionalDetails.deleteUserData(student_id).then(function (Instructional) {
                            models.GradeToPercentageLetter.deleteUserData(student_id).then(function (GradeToPrecentage) {
                                models.Institution_details.deleteUserData(student_id).then(function (Institution) {
                                    models.competency_letter.deleteUserData(student_id).then(function (competency_letter) {
                                        models.Hrd_details.deleteUserData(student_id).then(function (Hrd_details) {
                                            models.Cart.deleteUserData(student_id).then(async function (cart) {
                                                var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, student_name, 'documents reset ', student_app_id);
                                                res.json({
                                                    status: 200,
                                                    message: 'Document Deleted Successfully'
                                                });

                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    } else {
        res.json({
            status: 400,
            message: 'User Have Paid the Fees. So, we cannot Delete the Document'
        });
    }

})

router.post('/changeNameByAdmin', async (req, res) => {
    console.log('/changeNameByAdmin');

    var student_id = req.body.student_id;
    var student_app_id = req.body.student_app_id;
    var firstName = req.body.firstname;
    var lastName = req.body.lastname;
    var student_name = firstName + ' ' + lastName;
    var user_id = req.body.user_id;
    var user_name = req.body.user_name;

    var changeName = await functions.getChangeName(student_id, firstName, lastName);

    if (changeName == 1) {
        var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, student_name, 'name changed ', student_app_id);

        return res.json({
            status: 200,
            message: student_name + ' name changed successfully',
        });
    } else {
        res.json({
            status: 400,
            message: student_name + ' name failed to change'
        });
    }
})

router.post('/changeLocationByAdmin', async (req, res) => {
    console.log('/changeLocationByAdmin');

    var student_id = req.body.studentData.id;
    var student_app_id = req.body.studentData.app_id;
    var student_name = req.body.studentData.name + ' ' + req.body.studentData.surname;
    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    var location = req.body.location;

    var changeLocation = await functions.getChangeLocation(student_id, location);
    console.log('%%%%%%%%%%%', changeLocation);
    console.log('%%%%%%%%%%%', changeLocation.length);

    if (changeLocation == 1) {
        var createActivityTrackerChange = await functions.getCreateActivityTrackerChange(user_id, user_name, student_name, 'location changed ', student_app_id);

        return res.json({
            status: 200,
            message: student_name + ' location changed successfully',
        });
    } else {
        res.json({
            status: 400,
            message: student_name + ' location failed to change'
        });
    }

})

router.get('/getDocumentsData', async (req, res) => {
    console.log('/getDocumentsData');

    var student_id = req.query.student_id;
    var student_app_id = req.query.student_app_id;
    console.log('---------------********************', student_app_id);
    let encounteredColleges = {};
    var marksheetsData = [];
    var transcriptsData = [];
    var curriculumData = [];
    var gradtoperData = [];
    var competencyData = [];
    var letterfornamechangeData = [];
    var instructionalData = [];
    var affiliationData = [];
    var namechangeproofData = [];
    var documentsData = [];
    var extension;

    //marksheets
    var getApplied = await functions.getAppliedDetails(student_id, student_app_id);
    console.log('getApplied', JSON.stringify(getApplied));

    getApplied.forEach(async function (marksheets) {
        extension = marksheets.file_name.split('.').pop();
        console.log('get------------------', JSON.stringify(marksheets.collegeId));

        var collegeDetails = await functions.getCollegeDetails(marksheets.collegeId);

        marksheetsData.push({
            id: marksheets.id,
            name: marksheets.name,
            filePath: constant.BASE_URL + "/api/upload/marklist/" + student_id + "/" + marksheets.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            fileName: marksheets.file_name,
        })
    })

    //transcript
    var getTranscripts = await functions.getUserTrascripts(student_id, student_app_id);

    getTranscripts.forEach(async function (transcripts) {
        extension = transcripts.file_name.split('.').pop();

        var collegeDetails = await functions.getCollegeDetails(transcripts.collegeId);

        transcriptsData.push({
            id: transcripts.id,
            name: transcripts.name,
            filePath: constant.BASE_URL + "/api/upload/transcript/" + student_id + "/" + transcripts.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            fileName: transcripts.file_name,
        })
    })

    //instructional
    var getInstructional = await functions.getUserInstructional(student_id, student_app_id);

    getInstructional.forEach(function (instructional) {

        instructionalData.push({
            id: instructional.id,
            name: instructional.studentName,
            course: instructional.courseName,
            college: instructional.collegeName,
            specialization: instructional.specialization,
            duration: instructional.duration,
            division: instructional.division,
            yearofpassing: instructional.yearofpassing,
            education_type: instructional.education_type,
        })
    })

    //curriculum
    var getCurriculum = await functions.getUserCurriculum(student_id, student_app_id);

    getCurriculum.forEach(async function (curriculum) {
        extension = curriculum.file_name.split('.').pop();

        var collegeDetails = await functions.getCollegeDetails(curriculum.collegeId);

        curriculumData.push({
            id: curriculum.id,
            name: curriculum.name,
            filePath: constant.BASE_URL + "/api/upload/curriculum/" + student_id + "/" + curriculum.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            fileName: curriculum.file_name,
        })
    })

    //gradetoper
    var getGradtoper = await functions.getUserGradtoper(student_id, student_app_id);

    getGradtoper.forEach(async function (gradtoper) {
        extension = gradtoper.file_name.split('.').pop();

        var collegeDetails = await functions.getCollegeDetails(gradtoper.collegeId);

        gradtoperData.push({
            id: gradtoper.id,
            name: gradtoper.name,
            filePath: constant.BASE_URL + "/api/upload/gradeToPercentLetter/" + student_id + "/" + gradtoper.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            fileName: gradtoper.file_name,
        })
    })

    //affiliation
    var getAffiliation = await functions.getUserAffiliation(student_id, student_app_id);

    getAffiliation.forEach(function (affiliation) {

        affiliationData.push({
            id: affiliation.id,
            name: affiliation.studentName,
            course: affiliation.courseName,
            college: affiliation.collegeName,
            specialization: affiliation.specialization,
            duration: affiliation.duration,
            division: affiliation.division,
            yearofpassing: affiliation.yearofpassing,
            education_type: affiliation.education_type,
        })
    })

    //competency
    var getCompetency = await functions.getUserCompetency(student_id, student_app_id);

    getCompetency.forEach(async function (competency) {
        extension = competency.file_name.split('.').pop();

        var collegeDetails = await functions.getCollegeDetails(competency.collegeId);

        competencyData.push({
            id: competency.id,
            name: competency.name,
            filePath: constant.BASE_URL + "/api/upload/CompetencyLetter/" + student_id + "/" + competency.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            fileName: competency.file_name,
        })
    })

    //letter for name change
    var getLetterfornamechange = await functions.getUserLetterfornamechange(student_id, student_app_id);

    getLetterfornamechange.forEach(async function (letterfornamechange) {
        extension = letterfornamechange.file_name.split('.').pop();

        var collegeDetails = await functions.getCollegeDetails(letterfornamechange.collegeId);

        letterfornamechangeData.push({
            id: letterfornamechange.id,
            name: letterfornamechange.name,
            filePath: constant.BASE_URL + "/api/upload/NameChangeLetter/" + student_id + "/" + letterfornamechange.file_name,
            extension: extension,
            collegeName: collegeDetails.name,
            firstnameaspermarksheet: letterfornamechange.firstnameaspermarksheet,
            fathersnameaspermarksheet: letterfornamechange.fathersnameaspermarksheet,
            mothersnameaspermarksheet: letterfornamechange.mothersnameaspermarksheet,
            lastnameaspermarksheet: letterfornamechange.lastnameaspermarksheet,
            firstnameasperpassport: letterfornamechange.firstnameasperpassport,
            fathersnameasperpassport: letterfornamechange.fathersnameasperpassport,
            lastnameasperpassport: letterfornamechange.lastnameasperpassport,
            fileName: letterfornamechange.file_name,
        })
    })

    //name change proof
    var getNameChangeProof = await functions.getUserNameChangeProof(student_id, student_app_id, 'extraDocument');

    getNameChangeProof.forEach(async function (namechangeproof) {
        extension = namechangeproof.file_name.split('.').pop();

        namechangeproofData.push({
            id: namechangeproof.id,
            name: namechangeproof.name,
            filePath: constant.BASE_URL + "/api/upload/NameChangeProof/" + student_id + "/" + namechangeproof.file_name,
            extension: extension,
        })
    })

    //all data
    documentsData.push({
        marksheetsData: marksheetsData,
        transcriptsData: transcriptsData,
        curriculumData: curriculumData,
        gradtoperData: gradtoperData,
        competencyData: competencyData,
        letterfornamechangeData: letterfornamechangeData,
        instructionalData: instructionalData,
        affiliationData: affiliationData,
        namechangeproofData: namechangeproofData,
    })

    if (documentsData.length > 0) {
        res.json({
            status: 200,
            data: documentsData,
        });
    } else {
        res.json({
            status: 400,
        });
    }

})

router.post('/deleteDocumentByAdmin', async (req, res) => {
    console.log('/deleteDocumentByAdmin');

    console.log('sddfsfdfdfdf', req.body.documentData);

    var id = req.body.documentData.id;
    var student_app_id = req.body.app_id;
    var user_id = req.body.user_id;
    var user_name = req.body.user_name;
    var type = req.body.type;
    var fileName = req.body.documentData.fileName;

    if (type == 'marksheets') {
        var deleteMarksheet = await functions.getDeleteMarksheet(id);

        if (deleteMarksheet == true) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, fileName, student_app_id);
            return res.json({
                status: 200,
                message: fileName + ' deleted successfully',
            });
        } else {
            res.json({
                status: 400,
                message: 'Failed to delete ' + fileName,
            });
        }
    } else if (type == 'transcripts') {
        var deleteTranscript = await functions.getDeleteTranscript(id);

        if (deleteTranscript == true) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, fileName, student_app_id);
            return res.json({
                status: 200,
                message: fileName + ' deleted successfully',
            });
        } else {
            res.json({
                status: 400,
                message: 'Failed to delete ' + fileName,
            });
        }
    } else if (type == 'curriculum') {
        var deleteCurriculum = await functions.getDeleteCurriculum(id);

        if (deleteCurriculum == true) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, fileName, student_app_id);
            return res.json({
                status: 200,
                message: fileName + ' deleted successfully',
            });
        } else {
            res.json({
                status: 400,
                message: 'Failed to delete ' + fileName,
            });
        }
    } else if (type == 'gradtoper') {
        var deleteCurriculum = await functions.getDeleteCurriculum(id);

        if (deleteCurriculum == true) {
            var createActivityTrackerDelete = await functions.getCreateActivityTrackerDelete(user_id, user_name, fileName, student_app_id);
            return res.json({
                status: 200,
                message: fileName + ' deleted successfully',
            });
        } else {
            res.json({
                status: 400,
                message: 'Failed to delete ' + fileName,
            });
        }
    } else {
        res.json({
            status: 400,
            message: 'Something went wrong while deleting ' + fileName,
        });
    }
})

router.post('/updateInstructionalAffiliation', async (req, res) => {
    console.log('/updateInstructionalAffiliation');

    var id = req.body.id;
    var formData = req.body.formData;
    var user_id = req.body.user_id;
    var user_email = req.body.user_email;
    var purpose = req.body.purpose;
    var type = req.body.type;
    var student_id = req.body.student_id;
    var student_app_id = req.body.student_app_id;

    if (type == 'add') {

    } else {
        var updateInstructionalAffiliation = await functions.getUpdateInstructionalAffiliation(id, student_app_id, formData, purpose);

        if (updateInstructionalAffiliation == true) {
            var createActivityTrackerUpdate = await functions.getCreateActivityTrackerUpdate(user_id, user_email, formData.courseName, student_app_id);

            return res.json({
                status: 200,
                message: formData.courseName + ' updated successfully',
            });
        } else {
            res.json({
                status: 400,
                message: 'Failed to update ' + formData.courseName,
            });
        }
    }
})

router.post('/uploadStudentDocument', (req, res) => {
    console.log('/uploadStudentDocument');

    var doc_name = req.body.doc_name;
    console.log('doc_name', doc_name);
    var doc_id = req.body.doc_id;
    console.log('doc_id', doc_id);
    var user_id = req.body.user_id;
    console.log('user_id', user_id);
    var type = req.body.type;
    console.log('type', type);

})

/**Fetched all the Application Data based on their application TRACKER and STATUS using STORE PROCEDURE*/
router.get('/getApplicationData', async (req, res) => {
    const tracker = req.query.tracker;
    const status = req.query.status;
    const app_id = req.query.app_id;
    const limit = req.query.limit;
    const offset = req.query.offset;
    const name = req.query.name;
    const email = req.query.email;
    const globalSearch = req.query.globalSearch;
    const students = [];  
    const count = await functions.getApplicationCount(tracker,status,app_id,name,email,globalSearch);

    const user = await models.Application.getUserApplications(tracker, status, app_id, limit, offset, name, email, globalSearch);
    if (user) {    
      for (const student of user) {
        const col = await models.Application.getCollegeDetails(student.id); 
        for(i=0;i<col.length;i++){ 
        students.push({
          id: student.id,
          name: student.name,
          email: student.email,
          tracker: student.tracker,
          college : col[i].college_Name,
          status : student.status,
          current_location: student.current_location,
          user_id : student.user_id, 
          instructionalField:student.instructionalField,
          educationalDetails:student.educationalDetails,
          CompetencyLetter : student.CompetencyLetter,
          Letterfor_NameChange : student.LetterforNameChange,
          gradToPer : student.gradToPer,
          curriculum:student.curriculum,
          affiliation : student.affiliation,
          type : student.type,
          notes : student.notes,
          approved_by : student.approved_by,
        //   collegeConfirmation : student.collegeConfirmation,
          application_date : moment(new Date(student.created_at)).format("DD/MM/YYYY")
        });
       }
      }
  
      res.json({
        status: 200,
        message: 'Students retrieved successfully',
        data: students,
        count:count
      });
    }
});

/** Reject Application Route from Pending Tab with activity Tracker*/
router.post('/rejectApplications', async (req, res) => {
    try {
        const userId = req.body.user_id;
        const appId = req.body.app_id;
        const adminEmail = req.body.admin_email;

        const user = await models.User.findOne({ 
            where : {
                id : userId
            }
        })
        if(user){
        const application = await models.Application.findOne({
            where: {
                user_id: userId,
                id: appId
            }
        });

        if (application) {
            const updatedApplication = await application.update({
                tracker: 'apply',
                status: 'reject'
            });

            if (updatedApplication) {
                let data = user.name +"'s ( "+user.email+" ) application rejected by "+adminEmail+".";
                let activity = "Application Rejected"; 
                functions.activitylog(userId,appId,activity,data,req);
                return res.json({
                    status: 200,
                    message: "User Application Rejected Successfully!"
                });
            } else {
                return res.json({
                    status: 400,
                    message: "Application Not Rejected!"
                });
            }
        } else {
            return res.json({
                status: 400,
                message: "Application Not Found"
            });
        }
    }else{
        return res.json({
            status: 400,
            message: "User Not Found"
        });
    }
    } catch (error) {
        console.error("Error in /rejectApplication", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
});

/** Verified Application Route from Pending Tab with activity Tracker*/
router.post('/verifiedApplication', async (req, res) => {
    try{
        const userId = req.body.user_id;
        const appId = req.body.app_id;
        const adminEmail = req.body.admin_email;

        const user = await models.User.findOne({
            where : {
                id : userId
            }
        })
        if(user) {
            const application = await models.Application.findOne({
                where : {
                    user_Id : userId,
                    id : appId
                }
            })
            if(application) {
                const updatedApplication = await application.update({
                    tracker : 'verified',
                    status : 'accept'
                })
                if (updatedApplication) {
                    let data = user.name +"'s ( "+user.email+" ) application verified by "+adminEmail+".";
                    let activity = "Application Verified"; 
                    functions.activitylog(userId,appId,activity,data,req);
                    return res.json({
                        status: 200,
                        message: "Application Verified Successfully!"
                    });
                } else {
                    return res.json({
                        status: 400,
                        message: "Application Not Verified!"
                    });
                }
            }  else {
                return res.json({
                    status: 400,
                    message: "Application Not Found"
                });
            }
        }else{
            return res.json({
                status: 400,
                message: "User Not Found"
            });
        }
  
    }catch(error){
        console.error("Error in /verifiedApplication", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})

/**Fetched all the Wes Application Data  using STORE PROCEDURE */
router.get('/getWesApplication', async (req, res) => {
    try {
        const name = req.query.name;
        const email = req.query.email;
        const appId = req.query.app_id;
        const wesNo = req.query.wesno;
        const limit = req.query.limit;
        const offset = req.query.offset;

        const wesApplicationCount = await models.Institution_details.getWesData(appId, name, email, wesNo, "", "");
        const count = wesApplicationCount.length;
        const wesApplication = await models.Institution_details.getWesData(appId, name, email, wesNo, limit, offset);

        return res.json({
            status: 200,
            data: wesApplication,
            count: count
        });

    } catch (error) {
        console.error("Error in /getWesApplication", error);
        return res.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
})


router.get('/getDownloadExcel', async (req, res) => {
    console.log('/getDownloadExcel');

    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    var type = req.query.type;
    var tracker = req.query.tracker;
    var status = req.query.status;
    var applicationData = [];

    const data = await models.Application.getDownloadExcel(startDate, endDate, tracker, status);

    if (type == 'total') {
        data.forEach(function (app) {
            applicationData.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Application status': app.tracker,
                'colleges': app.college_name,
                'application_date': app.created_at,
            })
        })
    } else if (type == 'pending') {
        data.forEach(function (app) {
            applicationData.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Student contact': app.mobile,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Colleges': app.college_name,
                'Application_date': app.created_at,
            })
        })
    } else if (type == 'verified') {
        data.forEach(function (app) {
            applicationData.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Approved by': app.approved_by,
                'Colleges': app.college_name,
                'Application_date': app.created_at,
            })
        })
    } else if (type == 'signed') {
        data.forEach(function (app) {
            applicationData.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Approved by': app.approved_by,
                'Emailed Date': app.updated_at,
                'Colleges': app.college_name,
                'Application_date': app.created_at,
            })
        })
    } else if (type == 'emailed') {
        data.forEach(function (app) {
            applicationData.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Approved by': app.approved_by,
                'Emailed Date': app.updated_at,
                'Colleges': app.college_name,
                'Application_date': app.created_at,
            })
        })
    } else if (type == 'finance') {
        data.forEach(function (app) {
            applicationapp.push({
                'Application Id': app.id,
                'Student Name': app.name,
                'Student Email': app.email,
                'Applied for': app.applied_for,
                'Purpose': app.type,
                'Approved by': app.approved_by,
                'Emailed Date': app.updated_at,
                'Colleges': app.college_name,
                // "OrderId": app.orderId,
                // "Transaction id": app.tracking_id,
                // "Split Status": app.split_status,
                // "Amount Payable": app.amount,
                // "CCAvenue Refernce No/Transaction id": app.tracking_id,
                // 'courses': course_name,
                'Application_date': app.created_at,
            })
        })
    } else {
        console.log('type not found!');
    }

    var xls = json2xls(applicationData);
    var file_location = constant.FILE_LOCATION + "/public/Excel/" + type + ".xlsx";
    fs.writeFileSync(file_location, xls, 'binary');
    var filepath = constant.FILE_LOCATION + "/public/Excel/" + type + ".xlsx";

    if (filepath) {
        res.json({
            status: 200,
            data: filepath
        })
    } else {
        res.json({
            status: 400
        })
    }
})

router.get('/getDownloadExcelBySaveAs', (req, res) => {
    console.log('/getDownloadExcelBySaveAs');

    var filepath = req.query.filepath;

    const downloadData = filepath;
    console.log("downloadData", downloadData);
    res.download(downloadData);
})

router.post('/resendApplication', async (req, res) => {
    console.log('/resendApplication');

    var user_id = req.body.user_id;
    var app_id = req.body.app_id;
    var user_name = req.body.user_name;
    var type = req.body.type;
    var admin_email = req.body.admin_email;
    var tracker;
    var status;

    //verified to pending
    if (type == 'pending') {
        tracker = 'apply';
        status = 'new';
    } else {
        tracker = 'verified';
        status = 'accept';
    }

    //signed to verified
    if (type == 'verified') {
        tracker = 'verified';
        status = 'accept';
    } else {
        tracker = 'signed';
        status = 'accept';
    }

    var resend = await functions.getResendRejectApplication(user_id, app_id, tracker, status);
    console.log('resend-------->', resend);
    console.log('resend-------->', resend.length);

    if (resend == true) {
        var data = user_name + "'s Application no " + app_id + " is resend by " + admin_email;
        var activity = "Application resend";

        functions.activitylog(user_id, app_id, activity, data,req);

        res.json({
            status: 200,
            message: 'Application resend successfully ' + type + ' applications',
        })
    } else {
        res.json({
            status: 400,
            message: 'Failed to resend application',
        })
    }

})

router.post('/rejectApplication', async (req, res) => {
    console.log('/rejectApplication');

    var user_id = req.body.user_id;
    var app_id = req.body.app_id;
    var user_name = req.body.user_name;
    var type = req.body.type;
    var admin_email = req.body.admin_email;
    var tracker;
    var status;

    //verified to pending
    if (type == 'pending') {
        tracker = 'apply';
        status = 'reject';
    } else {
        tracker = 'verified';
        status = 'accept';
    }

    //signed to verified
    if (type == 'verified') {
        tracker = 'verified';
        status = 'reject';
    } else {
        tracker = 'signed';
        status = 'accept';
    }

    var reject = await functions.getResendRejectApplication(user_id, app_id, tracker, status);
    console.log('reject-------->', reject);
    console.log('reject-------->', reject.length);

    if (reject == true) {
        var data = user_name + "'s Application no " + app_id + " is reject by " + admin_email;
        var activity = "Application reject";

        functions.activitylog(user_id, app_id, activity, data,req);

        res.json({
            status: 200,
            message: 'Application reject successfully to ' + type + ' applications',
        })
    } else {
        res.json({
            status: 400,
            message: 'Failed to reject application',
        })
    }

})

router.post('/updateNotes', async (req, res) => {
    console.log('/updateNotes');

    var notes_data = req.body.notes_data;
    var user_id = req.body.user_id;
    var app_id = req.body.app_id;
    // var type = req.body.type;
    var admin_email = req.body.admin_email;

    var updateNotes = await functions.getUpdateUserNotes(notes_data, app_id);
    console.log('up----------------', updateNotes);
    console.log('up----------------', updateNotes.length);

    if (updateNotes == true) {
        var data = "Note of application " + app_id + " is updated by " + admin_email;
        var activity = "Note Updated";

        functions.activitylog(user_id, app_id, activity, data,req);

        res.json({
            status: 200,
            message: "Notes Saved Successfully!",
        })
    } else {
        res.json({
            status: 400,
            message: "Failed to save notes",
        })
    }

})

module.exports = router;
