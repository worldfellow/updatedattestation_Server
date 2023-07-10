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
Application.getUserApplications =function(tracker,status,app_id,limit,offset,name,email,globalSearch){ 
  let LimitOffset = "LIMIT" + " " + limit + " OFFSET" + " "+ offset; 
  let appId;
  let searchEmail;
  let global_Search;
  let app_Tracker;
  let app_status;

  if(tracker){
    app_Tracker="AND tracker='"+tracker+"'"
  }
  if(status){
    app_status="AND status='"+status+"'";
  }
console.log("status",status);
  if(app_id == "null"){
     appId ="";
  }else{
    appId="AND a.id='"+app_id+"'";
  }
 if(email == "null"){
  searchEmail ="";
}else{
  searchEmail="AND u.email='"+email+"'";
} 
if(globalSearch == "null"){
  global_Search ="";
}else{
  global_Search="AND  CONCAT(u.name, ' ', u.surname, ' ',u.email, ' ',a.id) LIKE '%"+globalSearch+"%'";
}
  return sequelize.query('CALL sp_getTotalApplication(:where_tracker, :where_status, :where_application_id, :limitOffsetVal, :where_email, :where_name, :where_globalSearch)', {
    replacements: {
      where_tracker: app_Tracker ? app_Tracker : "",
      where_status: app_status ? app_status :  "",
      where_application_id: appId ? appId :  " ",
      limitOffsetVal : LimitOffset ? LimitOffset : "",
      where_email : searchEmail ? searchEmail : "",
      where_name: name ? name : " ", 
      where_globalSearch : global_Search ? global_Search : ""
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