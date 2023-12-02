"use strict";

module.exports = function (sequelize, DataTypes) {
  var UserTranscript = sequelize.define("User_Transcript", {
    name: DataTypes.TEXT,
    file_name: DataTypes.TEXT,
    education_type: DataTypes.STRING(30),
    collegeId: DataTypes.STRING(30),
    faculty: DataTypes.STRING(30),
    pattern: {
      type: DataTypes.ENUM('Annual', 'Semester'),
      allowNull: true,
      defaultValue: null
    },
    lock_transcript: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: 0
    },
    upload_step: {
      type: DataTypes.ENUM('default', 'requested', 'changed'),
      allowNull: false,
      defaultValue: 'default'
    },
    user_id: DataTypes.INTEGER,
    verify_doc: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
      defaultValue: 0
    },
  });

  UserTranscript.updateEmailStatus = function (id, status) {
    var query = "Update User_Transcript set collegeEmailStatus = '" + status + "' where id = " + id;
    return sequelize.query(query, { type: sequelize.QueryTypes.UPDATE });
  },

    UserTranscript.updateSingleCollegeEmailStatus = function (user_id, college_id, msgID, value) {
      var query = "Update User_Transcript set collegeEmailStatus = '" + value + "', emailMsgId='" + msgID + "' where user_id = " + user_id + " and collegeId = " + college_id;
      return sequelize.query(query, { type: sequelize.QueryTypes.UPDATE });
    },

    UserTranscript.getCollegeName = function (user_id) {
      var query = "SELECT DISTINCT college.id, college.name, college.emailId, college.contactPerson, college.contactNo, college.alternateContactPerson, college.alternateContactNo, college.alternateEmailId, transcript.collegeEmailStatus as collegeEmailStatus, transcript.app_id FROM User_Transcript AS transcript ";
      query += " JOIN College AS college ON college.id = transcript.collegeId ";
      query += " WHERE user_id = " + user_id;
      return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    },

    UserTranscript.getCollegeIDs = function (user_id) {
      // var query = "SELECT DISTINCT college.id, college.name, college.emailId, college.contactPerson, college.contactNo, college.alternateContactPerson, college.alternateContactNo, college.alternateEmailId, transcript.collegeEmailStatus FROM User_Transcript AS transcript ";
      // query += " JOIN College AS college ON college.id = transcript.collegeId ";
      // query += " WHERE user_id = " + user_id;

      var query = "SELECT CONCAT_WS( GROUP_CONCAT(distinct(ut.collegeId)), GROUP_CONCAT(distinct(insd.collegeId)), GROUP_CONCAT(distinct(uc.collegeId)) ) as collegeId, GROUP_CONCAT( DISTINCT ( ut.collegeEmailStatus ) ) as TranscriptStatus, GROUP_CONCAT( DISTINCT ( isd.emailStatus ) ) as instructionStatus, GROUP_CONCAT( DISTINCT ( uc.emailStatus ) ) as curriculumStatus, ut.user_id from User_Transcript as ut ";
      query += " Left Join userMarkList as insd on insd.user_id = ut.user_id ";
      query += " Left Join InstructionalDetails as isd on isd.userId = insd.user_id";
      query += " Left Join User_Curriculum as uc on uc.user_id = ut.user_id";
      query += " where ut.user_id = " + user_id;
      query += " GROUP BY ut.user_id";
      return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    },

    UserTranscript.getDistinctCollege = function (user_id) {
      var query = "SELECT DISTINCT collegeId FROM User_Transcript WHERE user_id = " + user_id;
      return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
    }

  UserTranscript.setAppIds = function (user_id, app_id) {
    var query = "Update User_Transcript set app_id = '" + app_id + "' where app_id is null and user_id =" + user_id;// WHERE created_at between '" + condition + "'";
    return sequelize.query(query, { type: sequelize.QueryTypes.UPDATE });
  }

  UserTranscript.getNewTranscript = function (user_id, app_date) {
    var query = "select DISTINCT collegeId from User_Transcript where user_id = " + user_id + " AND updated_at > '" + app_date + "'";
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }

  UserTranscript.deleteUserData = function (user_id) {
    var query = "DELETE FROM User_Transcript WHERE user_id = " + user_id;
    return sequelize.query(query, { type: sequelize.QueryTypes.DELETE });
  }

  UserTranscript.belongsTo(sequelize.models.User, { foreignKey: 'user_id' });
  UserTranscript.hasOne(sequelize.models.Emailed_Docs, { foreignKey: 'transcript_id' });
  UserTranscript.belongsTo(sequelize.models.Application, { foreignKey: 'app_id' });

  return UserTranscript;
};
