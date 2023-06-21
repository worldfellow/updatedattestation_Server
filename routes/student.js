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

/* Editor : Prathmesh Pawar
Route : educationalDetails - check email and password and return token and access to proceed ahead to student.
Paramater : email and password of student */
router.post('/login', async (req, res) => {
    console.log('/login');

    // Correct email and password stored in the backend
    email = req.body.email;
    password = req.body.password;
    var user = {};
    var roles = '';

    var hashPassword = functions.generateHashPassword(password);

    var getEmailDetails = await functions.getUserEmailDetails(email, hashPassword);

    if (getEmailDetails) {
        if (getEmailDetails.is_otp_verified == true || getEmailDetails.is_otp_verified == 1 || getEmailDetails.is_email_verified) {
            var getPasswordDetails = await functions.getUserEmailDetails(email, hashPassword);

            if (getPasswordDetails) {
                if (getEmailDetails.email == email && getEmailDetails.password == hashPassword) {
                    if (getEmailDetails.is_otp_verified == true || getEmailDetails.is_email_verified == true) {
                        if (getEmailDetails.user_type == 'student') {
                        } else {
                            var getRoleDetails = await functions.getRoleDetails(getEmailDetails.id);

                            if(getRoleDetails){
                                if(getRoleDetails.adminManagement == true){
                                    roles += 'adminManagement'
                                }if(getRoleDetails.roleManagement == true){
                                    roles += 'roleManagement'
                                }if(getRoleDetails.studentManagement == true){
                                    roles += 'studentManagement'
                                }if(getRoleDetails.adminEmailTracker == true){
                                    roles += 'adminEmailTracker'
                                }if(getRoleDetails.adminTotal == true){
                                    roles += 'adminTotal'
                                }if(getRoleDetails.adminPending == true){
                                    roles += 'adminPending'
                                }if(getRoleDetails.adminVerified == true){
                                    roles += 'adminVerified'
                                }if(getRoleDetails.adminSigned == true){
                                    roles += 'adminSigned'
                                }if(getRoleDetails.adminPayment == true){
                                    roles += 'adminPayment'
                                }if(getRoleDetails.adminDashboard == true){
                                    roles += 'adminDashboard'
                                }if(getRoleDetails.adminReport == true){
                                    roles += 'adminReport'
                                }if(getRoleDetails.adminhelp == true){
                                    roles += 'adminhelp'
                                }if(getRoleDetails.adminemailed == true){
                                    roles += 'adminemailed'
                                }if(getRoleDetails.collegeManagement == true){
                                    roles += 'collegeManagement'
                                }if(getRoleDetails.dashboard == true){
                                    roles += 'dashboard'
                                }if(getRoleDetails.adminWesApp == true){
                                    roles += 'adminWesApp'
                                }if(getRoleDetails.adminActivityTracker == true){
                                    roles += 'adminActivityTracker'
                                }else{}

                                console.log('roles',roles);

                            }
                        }
                        user.user_id = getEmailDetails.id;
                        user.user_name = getEmailDetails.name;
                        user.user_surname = getEmailDetails.surname;
                        user.user_email = getEmailDetails.email;
                        user.user_mobile = getEmailDetails.mobile;
                        user.user_student_category = getEmailDetails.student_category;
                        user.user_address = (getEmailDetails.address1) ? getEmailDetails.address1 : null;
                        user.user_phone_number = getEmailDetails.mobile;
                        user.profileCompleteness = getEmailDetails.profile_completeness;
                        user.theme = getEmailDetails.theme;
                        user.country_birth = getEmailDetails.country_birth;
                        user.user_type = getEmailDetails.user_type;
                        user.login_count = getEmailDetails.login_count;
                        user.source = getEmailDetails.source;
                        user.password = getEmailDetails.password;
                        user.current_location = getEmailDetails.current_location;
                        user.mobile_country_code = getEmailDetails.mobile_country_code;
                        user.roles = roles;
                        return res.json({
                            status: 200,
                            data: {
                                message: 'Successfully logged in!',
                                token: functions.createAccessToken(user),
                                user: user,
                            }
                        });
                    }
                }
            } else {
                res.json({
                    status: 400,
                    message: 'Your password does not exist.'
                })
            }
        } else {
            res.json({
                status: 400,
                message: 'Please verify your account.'
            })
        }
    } else {
        console.log("KKKKK");
        res.json({
            status: 400,
            message: email + ' does not exist in our system.'
        })
    }
})

/* Author : Prathmesh Pawar
Route : educationalDetails - create & update educational details of step 1.
Paramater : formdata and user_id of student */
router.post('/educationalDetails', async (req, res) => {
    console.log("/educationalDetails");

    var user_id = req.body.user_id;

    var applied_for_details = await functions.getAppliedForDetails(user_id, null);

    if (applied_for_details) {
        var updatedAppliedDetails = await functions.getUpdatedEducationalDetails(user_id, req.body.formdata);
        if (updatedAppliedDetails) {
            res.json({
                status: 200,
                message: "updated"
            })
        }
    }
    else {
        var createdAppliedDetails = await functions.getCreateEducationalDetails(user_id, req.body.formdata);
        if (createdAppliedDetails) {
            res.json({
                status: 200,
                message: "added"
            })
        }
    }
})

/* Author : Prathmesh Pawar
Route : getPurposeList - get list of purpose for dropdown list name in step 3 and show inputs on addInstitutionDialog box as per table boolean values.
Paramater : purposeList and purpose_name of student */
router.get('/getPurposeList', async (req, res) => {
    console.log("/getPurposeList");

    var purpose_name = req.query.purpose_name;
    if (purpose_name) {
        var purposeList = await functions.getPurposeListByPurposeName(purpose_name);
    } else {
        var purposeList = await functions.getPurposeList();
    }

    if (purposeList) {
        res.json({
            status: 200,
            data: purposeList
        });
    } else {
        res.json({
            status: 400
        });
    }
})

/* Author : Prathmesh Pawar
Route : updateAllInstitute - create & update purpose data of student side.
Paramater : type, refNo, wesEmail, wesName, wesSurname, universityCompanyName, name, countryName, contactPersonName, contactNo, emails, user_type, user_id, app_id, institute_id and function_type of student */
router.post('/updateAllInstitute', async (req, res) => {
    console.log('/updateAllInstitute');

    var universityName = req.body.universityCompanyName;
    var country = req.body.countryName;
    var email = req.body.emails;
    var emailArr;
    var anotherEmailArr;
    var anotherEmail;
    var contactNumber = req.body.contactNo;
    var refno = req.body.refNo;
    var user_id = req.body.user_id;
    var contact_person = req.body.contactPersonName;
    var emailAsWes = req.body.wesEmail;
    var nameaswes = req.body.wesName;
    var lastnameaswes = req.body.wesSurname;
    var name = req.body.name;
    var amount;
    var app_id = req.body.app_id;
    var type = req.body.type;
    var institute_id = req.body.institute_id;
    var function_type = req.body.function_type;

    var applied = await functions.getEducationalDetailsCount(user_id, null);

    const counts = Object.values(JSON.parse(JSON.stringify(applied))).filter((value) => {
        return value == true;
    });

    var count = counts.length;

    var user = await functions.getUserDetails(user_id);

    if (user[0].current_location == "WITHIN") {
        amount = 536 * count;
    } else if (user[0].current_location == "OUTSIDE") {
        amount = 8308 * count;
    }

    if (email) {
        emailArr = email.split(',');
        if (emailArr.length > 1) {
            anotherEmailArr = emailArr.shift();
            anotherEmail = emailArr.toString();
        } else {
            anotherEmailArr = email;
            anotherEmail = null;
        }
    } else {
        emailArr = null;
        anotherEmailArr = null;
        anotherEmail = null;
    }

    //create purpose data
    if (function_type == 'add') {
        var createInstitute = await functions.getCreateInstitution(universityName, country, emailArr, contactNumber, user_id, contact_person, type, refno, emailAsWes, nameaswes, lastnameaswes, name, app_id, anotherEmailArr);

        if (createInstitute) {
            if (createInstitute) {
                res.json({
                    status: 200,
                    message: type + " data inserted successfully!"
                })
            } else {
                res.json({
                    status: 400,
                    message: type + " data failed to insert!"
                })
            }
        }
    } else {//update purpose data
        var updateInstitute = await functions.getUpdateInstitution(universityName, country, emailArr, contactNumber, user_id, contact_person, type, refno, emailAsWes, nameaswes, lastnameaswes, name, app_id, anotherEmailArr, institute_id);

        if (updateInstitute) {
            if (updateInstitute) {
                res.json({
                    status: 200,
                    message: type + " data updated Successfully!"
                })
            } else {
                res.json({
                    status: 400,
                    message: type + " data failed to update!"
                })
            }
        }
    }
})

/* Author : Prathmesh Pawar
Route : deleteInstituteHrd - delete both purpose records all institute as well as hrd.
Paramater : institute_id, purpose_name and user_id of student */
router.post('/deleteInstituteHrd', async (req, res) => {
    console.log('/deleteInstitute');

    var institute_id = req.body.institute_id;
    var purpose_name = req.body.purpose_name;
    var user_id = req.body.user_id;

    if (purpose_name == 'HRD') {
        var deleteHrd = await functions.getDeleteHrd(institute_id);

        if (deleteHrd) {
            var checkHrd = await functions.checkHrdDetails(user_id);

            if (checkHrd.length == 0) {
                var deleteHrdInstitute = await functions.getDeleteHrdInstitute(user_id, purpose_name);

                if (deleteHrdInstitute) {
                    res.json({
                        status: 200,
                        message: purpose_name + " data deleted successfully!"
                    })
                } else {
                    res.json({
                        status: 400,
                        message: purpose_name + " data failed to delete!"
                    })
                }
            } else {
                res.json({
                    status: 200,
                    message: purpose_name + " data deleted successfully!"
                })
            }
        } else {
            res.json({
                status: 400,
                message: purpose_name + " data failed to delete!"
            })
        }
    } else {
        var deleteInstitute = await functions.getDeleteInstitution(institute_id);
        console.log('deleteInstitute', deleteInstitute);
        console.log('deleteInstitute', deleteInstitute.length);

        if (deleteInstitute) {
            res.json({
                status: 200,
                message: purpose_name + " data deleted successfully!"
            })
        } else {
            res.json({
                status: 400,
                message: purpose_name + " data failed to delete!"
            })
        }
    }
})


/* Author : Prathmesh Pawar
Route : getInstituteData - get all institute data to show on purpose page and get single institute data for patchvales while editing.
Paramater : app_id, purpose_name, user_type, institute_id and user_id of student */
router.get('/getInstituteData', async (req, res) => {
    console.log('/getInstituteData');

    var purpose_name = req.query.purpose_name;
    var app_id = req.query.app_id;
    var user_id = req.query.user_id;
    var institute_id = req.query.institute_id;
    var status;
    var data = [];

    //get single institute data
    if (purpose_name) {
        var getInstituteData = await functions.getInstituteDataSingle(institute_id, purpose_name);

        if (getInstituteData) {
            status = 'Not Applied';

            if (getInstituteData.length > 0) {
                getInstituteData.forEach(institute => {
                    data.push({
                        id: institute.id,
                        university_name: institute.university_name,
                        email: institute.email,
                        country_name: institute.country_name,
                        contact_number: institute.contact_number,
                        status: status,
                        contact_person: institute.contact_person,
                        type: institute.type,
                        reference_no: institute.refno,
                        emailAsWes: institute.emailAsWes,
                        nameaswes: institute.nameaswes,
                        lastnameaswes: institute.lastnameaswes,
                        name: institute.name,
                        user_id: institute.user_id,
                    })
                });

                if (data.length == getInstituteData.length) {
                    res.json({
                        status: 200,
                        data: data
                    });
                }
            } else {
                res.json({
                    status: 400
                });
            }
        }
    } else {
        console.log(' inside else')
        //get all institute data
        var getInstituteData = await functions.getInstituteDataAll(user_id, null);
        if (getInstituteData.length > 0) {
            status = 'Not Applied';

            if (getInstituteData.length > 0) {
                getInstituteData.forEach(institute => {
                    data.push({
                        id: institute.id,
                        university_name: institute.university_name,
                        email: institute.email,
                        country_name: institute.country_name,
                        contact_number: institute.contact_number,
                        status: status,
                        contact_person: institute.contact_person,
                        type: institute.type,
                        reference_no: institute.refno,
                        emailAsWes: institute.emailAsWes,
                        nameaswes: institute.nameaswes,
                        lastnameaswes: institute.lastnameaswes,
                        name: institute.name,
                        user_id: institute.user_id,
                        other_email: institute.otherEmail,
                    })
                });

                if (data.length == getInstituteData.length) {
                    res.json({
                        status: 200,
                        data: data
                    });
                }
            } else {
                res.json({
                    status: 400
                });
            }
        } else {
            console.log(' ins elseeee')
            res.json({
                status: 400
            });
        }
    }


})

/* Author : Prathmesh Pawar
Route : getAppliedDetails - get students details that is applied for which degree.
Paramater : app_id, user_type and user_id of student */
router.get('/getAppliedDetails', async (req, res) => {
    console.log('/getAppliedDetails');

    var user_id = req.query.user_id;
    var app_id = req.query.app_id;
    var Masters;
    var Bachelors;
    var Phd;
    var data = [];

    var getApplied = await functions.getAppliedDetails(user_id, null);

    getApplied.forEach(function (type) {
        if (type.education_type.includes('Masters')) {
            Masters = true
        }
        if (type.education_type.includes('Bachelors')) {
            Bachelors = true
        }
        if (type.education_type.includes('Phd')) {
            Phd = true
        }
    })

    data.push({
        Bachelors: Bachelors,
        Masters: Masters,
        Phd: Phd,
    })

    if (data.length > 0) {
        res.json({
            status: 200,
            data: data
        });
    } else {
        res.json({
            status: 400
        });
    }
})

/* Author : Prathmesh Pawar
Route : getHrdInfo - get students details for pre-filled name & course_name & annual semester pattern as well as for diierent courses.
Paramater : degree_type, faculty_type and user_id of student */
router.get('/getHrdInfo', async (req, res) => {
    console.log('/getHrdInfo');

    var user_id = req.query.user_id;
    var degree_type = req.query.degree_type;
    var data = [];
    let encounteredFaculties = {};
    var faculty_types = req.query.faculty_type;


    var user = await functions.getUserDetails(user_id);

    if (faculty_types) {
        var faculty_type = faculty_types.split(' ').pop();
        var getUserMarklist_Upload = await functions.getUserMarklistUploadDetailsDifferent(user_id, degree_type, faculty_type, null);
    } else {
        var getUserMarklist_Upload = await functions.getUserMarklistUploadDetailsSame(user_id, degree_type, null);
    }
    getUserMarklist_Upload.forEach((item) => {
        let faculty = item.faculty;

        if (!encounteredFaculties[faculty]) {
            encounteredFaculties[faculty] = true;
            data.push({
                faculty: item.faculty,
                colleges: item.collegeId,
                pattern: item.pattern,
                type: item.education_type + ' of ' + item.faculty,
                fullName: user[0].name + ' ' + user[0].surname,
                degree: degree_type,
            });
        }
    });

    if (data.length > 0) {
        res.json({
            status: 200,
            data: data
        });
    } else {
        res.json({
            status: 400,
        });
    }
})

/* Author : Prathmesh Pawar
Route : updateAllHrd - create & update hrd purpose data of student side.
Paramater : degree_type, faculty_type, formData, function_type, secondlastSem, lastSem, purpose_name, hrd_id and user_id of student */
router.post('/updateAllHrd', async (req, res) => {
    console.log('/updateAllHrd');

    var formData = req.body.formData;
    var user_id = req.body.user_id;
    var function_type = req.body.function_type;
    var secondlastSem = req.body.secondlastSem;
    var degree_type = req.body.degree_type;
    var lastSem = req.body.lastSem;
    var purpose_name = req.body.purpose_name;
    var hrd_id = req.body.hrd_id;
    var emailArr;
    var anotherEmailArr;
    var anotherEmail;

    var applied = await functions.getEducationalDetailsCount(user_id, null);

    const counts = Object.values(JSON.parse(JSON.stringify(applied))).filter((value) => {
        return value == true;
    });

    var count = counts.length;

    var user = await functions.getUserDetails(user_id);

    if (user[0].current_location == "WITHIN") {
        amount = 536 * count;
    } else if (user[0].current_location == "OUTSIDE") {
        amount = 8308 * count;
    }

    if (formData.email) {
        emailArr = formData.email.split(',');
        if (emailArr.length > 1) {
            anotherEmailArr = emailArr.shift();
            console.log('11111', anotherEmailArr);
            anotherEmail = emailArr.toString();
            console.log('22222', anotherEmail);
        } else {
            anotherEmailArr = formData.email;
            anotherEmail = null;
        }
    } else {
        emailArr = null;
        anotherEmailArr = null;
        anotherEmail = null;
    }

    if (function_type == 'add') {
        var createHrd = await functions.getCreateHrd(user_id, formData, degree_type, secondlastSem, lastSem);

        if (createHrd) {
            var checkInstitute = await functions.checkInstitutionDetails(user_id, null, purpose_name);

            if (checkInstitute.length > 0) {
                res.json({
                    status: 200,
                    message: purpose_name + " data inserted successfully!",
                })
            } else {
                var createInstitute = await functions.getCreateHrdInstitute(user_id, purpose_name, emailArr, anotherEmailArr, anotherEmail);

                if (createInstitute) {
                    res.json({
                        status: 200,
                        message: purpose_name + " data inserted successfully!",
                    })
                } else {
                    res.json({
                        status: 400,
                        message: purpose_name + " data failed to insert!",
                    })
                }
            }
        } else {
            res.json({
                status: 400,
                message: purpose_name + " data failed to insert!",
            })
        }
    } else {
        var updateHrd = await functions.getUpdateHrd(user_id, formData, degree_type, secondlastSem, lastSem, hrd_id);

        if (updateHrd.length > 0) {
            res.json({
                status: 200,
                message: purpose_name + " data updated successfully!",
            })
        } else {
            res.json({
                status: 400,
                message: purpose_name + " data failed to update!",
            })
        }
    }
})

/* Author : Prathmesh Pawar
Route : getHrdData - get all hrd data to show on purpose page and get single hrd data for patchvales while editing.
Paramater : purpose_name, hrd_id and user_id of student */
router.get('/getHrdData', async (req, res) => {
    console.log('/getHrdData');

    var user_id = req.query.user_id;
    console.log('/user_id', user_id);
    var hrd_id = req.query.hrd_id;
    console.log('/hrd_id', hrd_id);
    var purpose_name = req.query.purpose_name;
    console.log('/purpose_name', purpose_name);

    if (purpose_name) {
        var hrdDetails = await functions.getHrdDetailsSingle(user_id, null, hrd_id);

        if (hrdDetails.length > 0) {
            res.json({
                status: 200,
                data: hrdDetails,
            })
        } else {
            res.json({
                status: 400
            })
        }
    } else {
        var hrdDetails = await functions.getHrdDetailsAll(user_id, null);

        if (hrdDetails.length > 0) {
            res.json({
                status: 200,
                data: hrdDetails,
            })
        } else {
            res.json({
                status: 400
            })
        }
    }
})

/* Author : Prathmesh Pawar
Route : preViewApplication - get all data to show users all details like educational,marksheets n all on preview page.
Paramater : user_id of student */
router.get('/preViewApplication', async (req, res) => {
    console.log('/preViewApplication');

    var user_id = req.query.user_id;
    let encounteredColleges = {};
    var educationalDetails = [];
    var collegeData = [];
    var marksheetsData = [];
    var transcriptsData = [];
    var curriculumData = [];
    var gradtoperData = [];
    var competencyData = [];
    var letterfornamechangeData = [];
    var instructionalData = [];
    var affiliationData = [];
    var preViewApplication = [];
    var extension;

    //educational details
    var applied_for_details = await functions.getAppliedForDetails(user_id, null);

    educationalDetails.push({
        educationalDetails: applied_for_details.educationalDetails,
        instructionalDetails: applied_for_details.instructionalField,
        curriculumDetails: applied_for_details.curriculum,
        gradtoperDetails: applied_for_details.gradToPer,
        affiliationDetails: applied_for_details.affiliation,
        competencyletterDetails: applied_for_details.CompetencyLetter,
        letterfornamechangeDetails: applied_for_details.LetterforNameChange,
    })

    //college data
    var getApplied = await functions.getAppliedDetails(user_id, null);

    getApplied.forEach(async function (userDetails) {
        let collegeId = userDetails.collegeId;

        if (!encounteredColleges[collegeId]) {
            encounteredColleges[collegeId] = true;

            var collegeDetails = await functions.getCollegeDetails(collegeId);

            collegeData.push({
                name: collegeDetails.name,
                year: userDetails.education_type + ' of ' + userDetails.faculty,
                degree: userDetails.education_type,
            })
        }
    })

    //marksheets
    getApplied.forEach(function (marksheets) {
        extension = marksheets.file_name.split('.').pop();

        marksheetsData.push({
            name: marksheets.name,
            filePath: constant.BASE_URL + "/api/upload/marklist/" + user_id + "/" + marksheets.file_name,
            extension: extension,
        })
    })

    //transcript
    var getTranscripts = await functions.getUserTrascripts(user_id, null);

    getTranscripts.forEach(function (transcripts) {
        extension = transcripts.file_name.split('.').pop();

        transcriptsData.push({
            name: transcripts.name,
            filePath: constant.BASE_URL + "/api/upload/transcript/" + user_id + "/" + transcripts.file_name,
            extension: extension,
        })
    })

    //instructional
    var getInstructional = await functions.getUserInstructional(user_id, null);

    getInstructional.forEach(function (instructional) {

        instructionalData.push({
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
    var getCurriculum = await functions.getUserCurriculum(user_id, null);

    getCurriculum.forEach(function (curriculum) {
        extension = curriculum.file_name.split('.').pop();

        curriculumData.push({
            name: curriculum.name,
            filePath: constant.BASE_URL + "/api/upload/curriculum/" + user_id + "/" + curriculum.file_name,
            extension: extension,
        })
    })

    //gradetoper
    var getGradtoper = await functions.getUserGradtoper(user_id, null);

    getGradtoper.forEach(function (gradtoper) {
        extension = gradtoper.file_name.split('.').pop();

        gradtoperData.push({
            name: gradtoper.name,
            filePath: constant.BASE_URL + "/api/upload/gradeToPercentLetter/" + user_id + "/" + gradtoper.file_name,
            extension: extension,
        })
    })

    //affiliation
    var getAffiliation = await functions.getUserAffiliation(user_id, null);

    getAffiliation.forEach(function (affiliation) {

        affiliationData.push({
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
    var getCompetency = await functions.getUserCompetency(user_id, null);

    getCompetency.forEach(function (competency) {
        extension = competency.file_name.split('.').pop();

        competencyData.push({
            name: competency.name,
            filePath: constant.BASE_URL + "/api/upload/CompetencyLetter/" + user_id + "/" + competency.file_name,
            extension: extension,
        })
    })

    //letter for name change
    var getLetterfornamechange = await functions.getUserLetterfornamechange(user_id, null);

    extension = getLetterfornamechange[0].file_name.split('.').pop();

    letterfornamechangeData.push({
        name: getLetterfornamechange[0].name,
        filePath: constant.BASE_URL + "/api/upload/NameChangeLetter/" + user_id + "/" + getLetterfornamechange[0].file_name,
        extension: extension,
        firstnameaspermarksheet: getLetterfornamechange[0].firstnameaspermarksheet,
        fathersnameaspermarksheet: getLetterfornamechange[0].fathersnameaspermarksheet,
        mothersnameaspermarksheet: getLetterfornamechange[0].mothersnameaspermarksheet,
        lastnameaspermarksheet: getLetterfornamechange[0].lastnameaspermarksheet,
        firstnameasperpassport: getLetterfornamechange[0].firstnameasperpassport,
        fathersnameasperpassport: getLetterfornamechange[0].fathersnameasperpassport,
        lastnameasperpassport: getLetterfornamechange[0].lastnameasperpassport,
    })

    preViewApplication.push({
        collegeData: collegeData,
        educationalDetails: educationalDetails,
        marksheetsData: marksheetsData,
        transcriptsData: transcriptsData,
        curriculumData: curriculumData,
        gradtoperData: gradtoperData,
        competencyData: competencyData,
        letterfornamechangeData: letterfornamechangeData,
        instructionalData: instructionalData,
        affiliationData: affiliationData,
    })

    console.log('preViewApplication--============================----', preViewApplication);

    if (preViewApplication.length > 0) {
        res.json({
            status: 200,
            data: preViewApplication
        });
    } else {
        res.json({
            status: 400,
        });
    }
})

module.exports = router;
