var crypto = require('crypto');
var randomstring = require('randomstring');
var constants = require('../config/constant');
var moment = require('moment');
var Moment = require('moment-timezone');
var models = require('../models');
algorithm = 'aes-256-ctr',
    password = 'je93KhWE08lH9S7SN83sneI87';
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
const express = require('express');
var router = express.Router();
const cfg = require('../auth/config');
const jwt = require('jwt-simple');
// const secret = cfg.jwtSecret;
// const jsonwebtoken = require('jsonwebtoken');
// const token = headers.authorization.split(' ')[1];

module.exports = {

    generateHashPassword: function (password) {
        var hashPassword = crypto
            .createHash("md5")
            .update(password)
            .digest('hex');

        return hashPassword;
    },

    createAccessToken: function (user) {
        var payload = {
            sub: user.user_id,
            exp: moment().add(cfg.accessTokenExpiresIn, 'seconds').unix(),
            iat: moment().unix(),
            id: user.user_id,
            email: user.user_email,
            name: user.user_name,
            surname: user.user_surname,
            mobile: user.user_mobile,
            category: user.user_student_category,
            profileCompleteness: user.profileCompleteness,
            role: user.user_type,
            country_birth: user.country_birth,
            theme: user.theme,
            user_type: user.user_type,
            login_count: user.login_count,
            applying_for: user.applying_for,
            mobile_country_code: user.mobile_country_code,
            roles: user.roles,
        };
        var token = jwt.encode(payload, cfg.jwtSecret);
        return token;
    },

    // accessToken: function (token) {
    //     console.log('***************>', token);
    //     // try {
    //     //     const decoded = jsonwebtoken.verify(token, secret);
    //     //     console.log('*************>', secret);
    //     //     return decoded;
    //     // } catch (err) {
    //     //     console.error('Token validation error:', err);
    //     //     return null;
    //     // }
    // },

    //Route /educationalDetails functions
    getAppliedForDetails: async (user_id, app_id) => {
        return models.Applied_For_Details.findOne({ where: { user_id: user_id, app_id: app_id } })
    },

    //Educational Details
    getUpdatedEducationalDetails: async (user_id, formdata) => {
        console.log('formdataformdata', formdata)
        return models.Applied_For_Details.update({ educationalDetails: formdata.educationalDetails, instructionalField: formdata.instructionalDetails, curriculum: formdata.curriculumDetails, gradToPer: formdata.gradToPer, affiliation: formdata.affiliation, CompetencyLetter: formdata.CompetencyLetter, LetterforNameChange: formdata.LetterforNameChange }, { where: { user_id: user_id } })
    },

    getCreateEducationalDetails: async (user_id, formdata) => {
        return models.Applied_For_Details.create({ user_id: user_id, educationalDetails: formdata.educationalDetails, instructionalField: formdata.instructionalDetails, curriculum: formdata.curriculumDetails, gradToPer: formdata.gradToPer, affiliation: formdata.affiliation, CompetencyLetter: formdata.CompetencyLetter, LetterforNameChange: formdata.LetterforNameChange })
    },

    //get list of purpose
    getPurposeList: async () => {
        return models.Purpose_List.findAll({})
    },

    getPurposeListByPurposeName: async (purpose_name) => {
        return models.Purpose_List.findAll({ where: { name: purpose_name } })
    },

    //get educational details count for payment
    getEducationalDetailsCount: async (user_id, app_id) => {
        return models.Applied_For_Details.findOne({ where: { user_id: user_id, app_id: app_id } })
    },

    //for user details
    getUserDetails: async (user_id) => {
        return models.User.findAll({ where: { id: user_id } })
    },

    //for user email and password details
    getUserEmailDetails: async (email, hashPassword) => {
        return models.User.findOne({ where: { email: email, password: hashPassword } })
    },

    //create institute
    getCreateInstitution: async (formData, emailArr, user_id, type, app_id, anotherEmailArr, anotherEmail) => {
        return models.Institution_details.create({
            university_name: formData.allUniversityCompanyName ? formData.allUniversityCompanyName : null,
            country_name: formData.allCountryName ? formData.allCountryName : null,
            email: emailArr ? anotherEmailArr : null,
            otherEmail: anotherEmail ? anotherEmail : null,
            contact_number: formData.allContactNo ? formData.allContactNo : null,
            user_id: user_id,
            contact_person: formData.allContactPersonName ? formData.allContactPersonName : null,
            type: type,
            refno: formData.allRefNo ? formData.allRefNo : null,
            emailAsWes: formData.wesEmail ? formData.wesEmail : null,
            nameaswes: formData.wesName ? formData.wesName : null,
            lastnameaswes: formData.wesSurname ? formData.wesSurname : null,
            name: formData.allName ? formData.allName : null,
            app_id: app_id ? app_id : null,
        })
    },

    //create cart /////not using
    getCreateCart: async (user_id, amount, createInstitute) => {
        return models.Cart.create({ user_id: user_id, fees: amount, institute_id: createInstitute.id, email: createInstitute.email, university_name: createInstitute.university_name })
    },

    //update institute
    getUpdateInstitution: async (formData, emailArr, user_id, type, app_id, anotherEmailArr, anotherEmail, institute_id) => {
        return models.Institution_details.update({
            university_name: formData.allUniversityCompanyName ? formData.allUniversityCompanyName : null,
            country_name: formData.allCountryName ? formData.allCountryName : null,
            email: emailArr ? anotherEmailArr : null,
            otherEmail: anotherEmail ? anotherEmail : null,
            contact_number: formData.allContactNo ? formData.allContactNo : null,
            user_id: user_id,
            contact_person: formData.allContactPersonName ? formData.allContactPersonName : null,
            type: type,
            refno: formData.allRefNo ? formData.allRefNo : null,
            emailAsWes: formData.wesEmail ? formData.wesEmail : null,
            nameaswes: formData.wesName ? formData.wesName : null,
            lastnameaswes: formData.wesSurname ? formData.wesSurname : null,
            name: formData.allName ? formData.allName : null,
            app_id: app_id ? app_id : null,
        }, { where: { id: institute_id } })
    },

    //update cart /////not using
    getUpdateCart: async (institute_id, amount, universityName, emailArr, user_id, anotherEmailArr) => {
        console.log('createInstitute.id---', institute_id);
        console.log('amount---', amount);
        console.log('emailArr---', emailArr);
        console.log('anotherEmailArr---', anotherEmailArr);
        console.log('universityName---', universityName);

        return models.Cart.update({ institute_id: institute_id, fees: amount, university_name: universityName, email: emailArr ? anotherEmailArr : null, user_id: user_id }, { where: { institute_id: institute_id } })
    },

    //get delete institution 
    getDeleteInstitution: async (institute_id) => {
        return models.Institution_details.destroy({ where: { id: institute_id } })
    },

    //get delete hrd
    getDeleteHrd: async (institute_id) => {
        return models.Hrd_details.destroy({ where: { id: institute_id } })
    },

    checkHrdDetails: async (user_id) => {
        return models.Hrd_details.findAll({ where: { user_id: user_id } })
    },

    //get delete hrdInstitute
    getDeleteHrdInstitute: async (user_id, purpose_name) => {
        return models.Institution_details.destroy({ where: { user_id: user_id, type: purpose_name } })
    },

    //get all institute data 
    getInstituteDataAll: async (user_id, app_id) => {
        return models.Institution_details.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    //get single institute data
    getInstituteDataSingle: async (institute_id, purpose_name) => {
        return models.Institution_details.findAll({ where: { id: institute_id, type: purpose_name } })
    },

    //get applied details
    getAppliedDetails: async (user_id, app_id) => {
        return models.UserMarklist_Upload.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserMarklistUploadDetailsSame: async (user_id, degree_type, app_id) => {
        return models.UserMarklist_Upload.findAll({ where: { user_id: user_id, education_type: degree_type, app_id: app_id } })
    },

    getUserMarklistUploadDetailsDifferent: async (user_id, degree_type, faculty_type, app_id) => {
        return models.UserMarklist_Upload.findAll({ where: { user_id: user_id, education_type: degree_type, faculty: faculty_type, app_id: app_id } })
    },

    getCreateHrd: async (user_id, formData, degree_type, secondlastSem, lastSem, app_id) => {
        return models.Hrd_details.create({
            fullName: formData.fullName ? formData.fullName : null,
            course_name: formData.courseName ? formData.courseName : null,
            seat_no: formData.seatNo ? formData.seatNo : null,
            seat_no_sem6: formData.seatNo_sem6 ? formData.seatNo_sem6 : null,
            seat_no_sem5: formData.seatNo_sem5 ? formData.seatNo_sem5 : null,
            prn_no: formData.prnNo ? formData.prnNo : null,
            cgpa: formData.cgpaNo ? formData.cgpaNo : null,
            cgpi: formData.cgpiNo ? formData.cgpiNo : null,
            transcript_no: formData.transcriptNo ? formData.transcriptNo : null,
            transcript_date: formData.transcriptDate ? formData.transcriptDate : null,
            exam_date: formData.examDate ? formData.examDate : null,
            specialization: formData.specialization ? formData.specialization : null,
            user_id: user_id ? user_id : null,
            app_id: app_id ? app_id : null,
            degree: degree_type ? degree_type : null,
            lastsem: lastSem ? lastSem : null,
            secondlastsem: secondlastSem ? secondlastSem : null,
        })
    },

    getUpdateHrd: async (user_id, formData, degree_type, secondlastSem, lastSem, hrd_id, app_id) => {
        return models.Hrd_details.update({
            fullName: formData.fullName ? formData.fullName : null,
            course_name: formData.courseName ? formData.courseName : null,
            seat_no: formData.seatNo ? formData.seatNo : null,
            seat_no_sem6: formData.seatNo_sem6 ? formData.seatNo_sem6 : null,
            seat_no_sem5: formData.seatNo_sem5 ? formData.seatNo_sem5 : null,
            prn_no: formData.prnNo ? formData.prnNo : null,
            cgpa: formData.cgpaNo ? formData.cgpaNo : null,
            cgpi: formData.cgpiNo ? formData.cgpiNo : null,
            transcript_no: formData.transcriptNo ? formData.transcriptNo : null,
            transcript_date: formData.transcriptDate ? formData.transcriptDate : null,
            exam_date: formData.examDate ? formData.examDate : null,
            specialization: formData.specialization ? formData.specialization : null,
            user_id: user_id ? user_id : null,
            app_id: app_id ? app_id : null,
            degree: degree_type ? degree_type : null,
            lastsem: lastSem ? lastSem : null,
            secondlastsem: secondlastSem ? secondlastSem : null,
        }, { where: { id: hrd_id } })
    },

    checkInstitutionDetails: async (user_id, app_id, purpose_name) => {
        return models.Institution_details.findAll({ where: { user_id: user_id, app_id: app_id, type: purpose_name } })
    },

    getCreateHrdInstitute: async (user_id, purpose_name, emailArr, anotherEmailArr, anotherEmail, app_id) => {
        return models.Institution_details.create({
            email: emailArr ? anotherEmailArr : null,
            otherEmail: anotherEmail ? anotherEmail : null,
            type: purpose_name ? purpose_name : null,
            user_id: user_id ? user_id : null,
            app_id: app_id ? app_id : null,
        })
    },

    getHrdDetailsAll: async (user_id, app_id) => {
        return models.Hrd_details.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getHrdDetailsSingle: async (user_id, app_id, hrd_id) => {
        return models.Hrd_details.findAll({ where: { user_id: user_id, app_id: app_id, id: hrd_id } })
    },

    getCollegeDetails: async (collegeId) => {
        return models.College.findOne({ where: { id: collegeId } })
    },

    getUserTrascripts: async (user_id, app_id) => {
        return models.User_Transcript.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserCurriculum: async (user_id, app_id) => {
        return models.User_Curriculum.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserGradtoper: async (user_id, app_id) => {
        return models.GradeToPercentageLetter.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserCompetency: async (user_id, app_id) => {
        return models.competency_letter.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserLetterfornamechange: async (user_id, app_id) => {
        return models.Letterfor_NameChange.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    getUserInstructional: async (user_id, app_id) => {
        return models.InstructionalDetails.findAll({ where: { userId: user_id, app_id: app_id } })
    },

    getUserAffiliation: async (user_id, app_id) => {
        return models.Affiliation_Letter.findAll({ where: { user_id: user_id, app_id: app_id } })
    },

    updateUser: async (user_id, otp) => {
        return models.User.update({ otp: otp }, { where: { id: user_id } })
    },

    getUserNameChangeProof: async (user_id, app_id, type) => {
        return models.User_Transcript.findAll({ where: { user_id: user_id, app_id: app_id, type: type } })
    },

    //get admin role details
    getRoleDetails: async (user_id) => {
        return models.Role.findOne({ where: { userid: user_id } })
    },

    getAddCollege: async (purpose, formData) => {
        return models.College.create({
            name: formData.collegeName ? formData.collegeName : null,
            contactPerson: formData.contactPersonName ? formData.contactPersonName : null,
            contactNo: formData.contactNo ? formData.contactNo : null,
            emailId: formData.email ? formData.email : null,
            alternateContactPerson: formData.alternateContactPersonName ? formData.alternateContactPersonName : null,
            alternateContactNo: formData.alternateContactNo ? formData.alternateContactNo : null,
            alternateEmailId: formData.alternateEmail ? formData.alternateEmail : null,
            type: purpose ? purpose : null,
            status: 'active',
        })
    },

    getUpdateCollege: async (purpose, formData, college_id) => {
        return models.College.update({
            name: formData.collegeName ? formData.collegeName : null,
            contactPerson: formData.contactPersonName ? formData.contactPersonName : null,
            contactNo: formData.contactNo ? formData.contactNo : null,
            emailId: formData.email ? formData.email : null,
            alternateContactPerson: formData.alternateContactPersonName ? formData.alternateContactPersonName : null,
            alternateContactNo: formData.alternateContactNo ? formData.alternateContactNo : null,
            alternateEmailId: formData.alternateEmail ? formData.alternateEmail : null,
            type: purpose ? purpose : null,
            status: 'active',
        }, { where: { id: college_id } })
    },

    getAllCollegeList: async () => {
        return models.College.findAll({})
    },

    getSingleCollegeList: async (id) => {
        return models.College.findAll({ where: { id: id } })
    },

    getAllFacultyList: async () => {
        return models.facultymaster.findAll({})
    },

    getSingleFacultyList: async (id) => {
        return models.facultymaster.findAll({ where: { id: id } })
    },

    getAddFaculty: async (formData) => {
        return models.facultymaster.create({
            faculty: formData.facultyName ? formData.facultyName : null,
            degree: formData.degreeName ? formData.degreeName : null,
            year: formData.year ? formData.year : null,
        })
    },

    getUpdateFaculty: async (formData, id) => {
        return models.facultymaster.update({
            faculty: formData.facultyName ? formData.facultyName : null,
            degree: formData.degreeName ? formData.degreeName : null,
            year: formData.year ? formData.year : null,
        }, { where: { id: id } })
    },

    getDeleteCollege: async (id) => {
        return models.College.destroy({ where: { id: id } })
    },

    getDeleteFaculty: async (id) => {
        return models.facultymaster.destroy({ where: { id: id } })
    },

    getActiveInactiveCollege: async (status, id) => {
        return models.College.update({
            status: status,
        }, { where: { id: id } })
    },

    getCreateActivityTrackerChange: async (user_id, changed_by, changed_item, status, app_id) => {
        console.log('djsdhdfhasiu', app_id);
        return models.Activitytracker.create({
            user_id: user_id,
            activity: changed_item + ' ' + status,
            data: changed_item + ' has ' + status + ' by ' + changed_by,
            application_id: app_id ? app_id : null,
        })
    },

    getCreateActivityTrackerDelete: async (user_id, deleted_by, deleted_item, app_id) => {
        return models.Activitytracker.create({
            user_id: user_id,
            activity: deleted_item + ' deleted',
            data: deleted_item + ' is deleted by ' + deleted_by,
            application_id: app_id ? app_id : null,
        })
    },

    getCreateActivityTrackerAdd: async (user_id, added_by, added_item, app_id) => {
        return models.Activitytracker.create({
            user_id: user_id,
            activity: added_item + ' added',
            data: added_item + ' is added by ' + added_by,
            application_id: app_id ? app_id : null,
        })
    },

    getCreateActivityTrackerUpdate: async (user_id, updated_by, updated_item, app_id) => {
        return models.Activitytracker.create({
            user_id: user_id,
            activity: updated_item + ' updated',
            data: updated_item + ' is updated by ' + updated_by,
            application_id: app_id ? app_id : null,
        })
    },

    // getCreateActivityTrackerReset: async (user_id, reset_by, reset_item, status, app_id) => {
    //     return models.Activitytracker.create({
    //         user_id: user_id,
    //         activity: reset_item + ' reset',
    //         data: reset_item + ' is reset by ' + reset_by, 
    //         application_id: app_id ? app_id: null,
    //     })
    // },

    getActivityTrackerList: async () => {
        return models.Activitytracker.findAll({})
    },

    getActivityTrackerSingle: async (user_id) => {
        return models.Activitytracker.findAll({ where: { user_id: user_id } })
    },

    generateRandomString: function (length, charset) {
        return randomstring.generate({
            length: length,
            charset: charset
        });
    },

    getAllAppliedDetails: async (user_id) => {
        return models.Applied_For_Details.findAll({ where: { user_id: user_id } })
    },


    getAllStudentDetails: async (user_type) => {
        return models.User.findAll({ where: { user_type: user_type } })
    },

    getActiveInactiveStudent: async (status, student_id) => {
        return models.User.update({
            user_status: status,
        }, { where: { id: student_id } })
    },

    getResetPassword: async (hashPassword, user_id) => {
        return models.User.update({
            password: hashPassword,
        }, { where: { id: user_id } })
    },

    getApplicationDetails: async (student_id) => {
        return models.Application.findOne({ where: { user_id: student_id } })
    },

    getChangeName: async (user_id, firstName, lastName) => {
        return models.User.update({
            name: firstName ? firstName : null,
            surname: lastName ? lastName : null,
        }, { where: { id: user_id } })
    },

    getChangeLocation: async (user_id, location) => {
        console.log('%%%%%%%%%%%', user_id);
        console.log('%%%%%%%%%%%', location);
        return models.User.update({
            current_location: location,
        }, { where: { id: user_id } })
    },

    getDeleteMarksheet: async (id) => {
        return models.UserMarklist_Upload.destroy({ where: { id: id } })
    },

    getDeleteTranscript: async (id) => {
        return models.User_Transcript.destroy({ where: { id: id } })
    },

    getDeleteCurriculum: async (id) => {
        return models.User_Transcript.destroy({ where: { id: id } })
    },

    getUpdateInstructionalAffiliation: async (id, app_id, formData, purpose) => {
        return models.InstructionalDetails.update({
            courseName: formData.courseName ? formData.courseName : null,
            collegeName: formData.collegeName ? formData.collegeName : null,
            specialization: formData.specialization ? formData.specialization : null,
            yearofpassing: formData.yearOfPassing ? formData.yearOfPassing : null,
            duration: formData.duration ? formData.duration : null,
            division: formData.passedWith ? formData.passedWith : null,
            education_type: formData.degree ? formData.degree : null,
            type: purpose ? purpose : null,
            app_id: app_id ? app_id : null,
        }, { where: { id: id } })
    },
};