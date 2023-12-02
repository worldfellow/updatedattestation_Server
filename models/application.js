"use strict";

module.exports = function (sequelize, DataTypes) {
  var Application = sequelize.define("Application", {
    tracker: DataTypes.ENUM('preapply', 'apply', 'verification', 'verified', 'done', 'signed'),
    status: {
      type: DataTypes.ENUM('new', 'accept', 'reject', 'repeat', 'requested'),
      allowNull: false
      //defaultValue: 'accept'
    },

    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    approved_by: DataTypes.STRING(100),
    notes: DataTypes.TEXT,
    transcriptRequiredMail: DataTypes.BOOLEAN(),
    collegeConfirmation: DataTypes.BOOLEAN(),
    rejectedNotes: DataTypes.TEXT,
    inComplete: DataTypes.JSON
  });

  /**getUserApplication Function to Fetched Application data from Database using Store procedure */
  Application.getUserApplications = async (tracker, status, app_id, name, email, globalSearch, purpose, limit, offset) => {
    return sequelize.query('CALL sp_getTotalApplication(:where_tracker, :where_status, :where_application_id, :where_name, :where_email, :where_globalSearch, :where_purpose, :limits, :offsets)', {
      replacements: {
        where_tracker: tracker ? tracker : "",
        where_status: status ? status : "",
        where_application_id: app_id ? app_id : " ",
        where_name: name ? name : " ",
        where_email: email ? email : "",
        where_globalSearch: globalSearch ? globalSearch : "",
        where_purpose: purpose ? purpose : "",
        limits: limit ? limit : "",
        offsets: offset ? offset : ""
      },
      type: sequelize.QueryTypes.RAW
    });
  }
  /**getCollegeDetails Function to Fetched college data using query */
  Application.getCollegeDetails = async (appId) => {
    const result = await sequelize.query(
      `SELECT  GROUP_CONCAT(DISTINCT col.name SEPARATOR '/') AS college_Name
    FROM application AS app
    JOIN usermarklist_upload AS usm ON usm.app_id = app.id
    JOIN college AS col ON col.id = usm.collegeId
    WHERE app.id = ${appId}`,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return result;
  };
  /**getEmailedData function to Fetched Emailed application data from database using Store Procedure */
  Application.getEmailedData = async (appId, name, email, globalSearch, limit, offset) => {
    return sequelize.query('CALL sp_getEmailApplication(:where_application_id, :where_name, :where_email, :where_globalSearch, :limits, :offsets)', {
      replacements: {
        where_application_id: appId ? appId : " ",
        where_name: name ? name : " ",
        where_email: email ? email : "",
        where_globalSearch: globalSearch ? globalSearch : "",
        limits: limit ? limit : "",
        offsets: offset ? offset : ""
      },
      type: sequelize.QueryTypes.RAW
    })
  }
  /** getEmailedCount function to Fetched Emailed application count from database using Store Procedure */
  Application.getEmailedCount = async (appId, name, email, globalSearch) => {
    return sequelize.query('CALL sp_emailApplicationCount(:where_application_id, :where_name, :where_email, :where_globalSearch )', {
      replacements: {
        where_application_id: appId ? appId : " ",
        where_name: name ? name : " ",
        where_email: email ? email : "",
        where_globalSearch: globalSearch ? globalSearch : ""
      },
      type: sequelize.QueryTypes.RAW
    })
  }

  Application.getDownloadExcel = function (startDate, endDate, tracker, status) {
    let created_at = "AND a.created_at";
    console.log('cre=============', created_at);
    let range_date = "BETWEEN '" + startDate + "' AND '" + endDate + "'";
    console.log('cre=============', range_date);

    return sequelize.query('CALL sp_getDownloadExcel(:where_tracker, :where_status, :where_created_at, :where_range_date)', {
      replacements: {
        where_tracker: tracker ? tracker : "",
        where_status: status ? status : "",
        where_created_at: created_at ? created_at : " ",
        where_range_date: range_date ? range_date : "",
      },
      type: sequelize.QueryTypes.RAW
    });
  }

  Application.getMyApplicationData = function (app_id) {
    var query = `SELECT apl.applied_for, apl.educationalDetails, apl.instructionalField, apl.curriculum, apl.gradToPer, apl.affiliation, apl.CompetencyLetter, apl.LetterforNameChange, app.id, app.tracker, app.status, app.created_at, GROUP_CONCAT(ins.type) as type, GROUP_CONCAT(ins.email) as email,GROUP_CONCAT(ins.otherEmail) as otherEmail, GROUP_CONCAT(ins.refno) as refno,GROUP_CONCAT(ins.emailAsWes) as wesemail
    FROM institution_details AS ins
    LEFT JOIN application AS app ON ins.app_id = app.id 
		JOIN applied_for_details AS apl ON ins.app_id = apl.app_id
    WHERE app.id  = ${app_id}`
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
  }

  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'user_id' });
    Application.hasOne(models.Institution_details, { foreignKey: 'id' });
    Application.hasOne(models.Applied_For_Details, { foreignKey: 'app_id' })
    Application.hasOne(models.Emailed_Docs, { foreignKey: 'app_id' });
    // Application.hasMany(models.UserMarklist_Upload);
  };


  return Application;
};