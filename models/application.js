"use strict";

module.exports = function (sequelize, DataTypes) {
  var Application = sequelize.define("Application", {
    tracker: DataTypes.ENUM('preapply', 'apply', 'verification', 'verified', 'done', 'signed'),
    status: {
      type: DataTypes.ENUM('new', 'accept', 'reject', 'repeat'),
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
    collegeConfirmation: DataTypes.BOOLEAN()
  });

  /**getUserApplication Function to Fetched Application data from Database using Store procedure */
Application.getUserApplications =function(tracker,status,app_id,name,email,globalSearch,limit,offset){  
  return sequelize.query('CALL sp_getTotalApplication(:where_tracker, :where_status, :where_application_id, :where_name, :where_email, :where_globalSearch, :limits, :offsets)', {
    replacements: {
      where_tracker: tracker ? tracker : "",
      where_status: status ? status :  "",
      where_application_id: app_id ? app_id :  " ", 
      where_name: name ? name : " ", 
      where_email : email ? email : "",
      where_globalSearch : globalSearch ? globalSearch : "",
      limits: limit ? limit : "",
      offsets: offset ? offset : ""
  },
    type: sequelize.QueryTypes.RAW
});
}
 /**getCollegeDetails Function to Fetched college data using query */
Application.getCollegeDetails = function(appId) {
  const query = `
    SELECT  GROUP_CONCAT(DISTINCT col.name SEPARATOR '/') AS college_Name
    FROM application AS app
    JOIN usermarklist_upload AS usm ON usm.app_id = app.id
    JOIN college AS col ON col.id = usm.collegeId
    WHERE app.id = ${appId}
    GROUP BY app.id;
  `;

  return sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
};



  Application.getDownloadExcel = function(startDate, endDate, tracker, status){
    let created_at = "AND a.created_at";
    console.log('cre=============',created_at);
    let range_date = "BETWEEN '"+ startDate + "' AND '" + endDate + "'";
    console.log('cre=============',range_date);

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

   

  Application.associate = (models) => {
    Application.belongsTo(models.User, { foreignKey: 'user_id' });
    Application.hasOne(models.Emailed_Docs, { foreignKey: 'app_id' });
  };
 
  return Application;
};