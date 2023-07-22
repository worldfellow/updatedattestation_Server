"use strict";

module.exports = function(sequelize, DataTypes) {
  var Institution_details = sequelize.define("Institution_details", {
    university_name: DataTypes.STRING(100),
    email: DataTypes.STRING(100),
    contact_number: DataTypes.STRING(17),
    country_name : DataTypes.TEXT,
    contact_person : DataTypes.STRING(100),
    type  : DataTypes.STRING(100),
    // address : DataTypes.TEXT,
		// landmark : DataTypes.TEXT,
    // pincode : DataTypes.STRING(20),
    refno : DataTypes.STRING(20),
    // cesno:DataTypes.STRING(20),
    // iqasno:DataTypes.STRING(20),
    // eduPerno:DataTypes.STRING(20),
    // icasno:DataTypes.STRING(20),
    wesupload:DataTypes.STRING(20),
    // studyrefno:DataTypes.STRING(255),
    // emprefno:DataTypes.STRING(255),
    // visarefno : DataTypes.STRING(255),
    visaaccno:DataTypes.STRING(255),
    empaccno :DataTypes.STRING(255),
    studyaccno : DataTypes.STRING(255),
    // myieeno:DataTypes.STRING(255),
    // icesno:DataTypes.STRING(255),
    // nasbano :DataTypes.STRING(255),
    wesrecord:DataTypes.STRING(255),
    // nceesno : DataTypes.STRING(255),
    // naricno : DataTypes.STRING(255),
    emailAsWes : DataTypes.STRING(255),
    // ncano : DataTypes.STRING(255),
    nameaswes :DataTypes.STRING(255),
    lastnameaswes:DataTypes.STRING(255),
    // hrdno:DataTypes.STRING(255),
    user_id :DataTypes.INTEGER(20),
    name: DataTypes.STRING(255),
    app_id :DataTypes.INTEGER(11),
    otherEmail : DataTypes.STRING(100),
  });

 

  Institution_details.deleteUserData = function(user_id){
    var query = "DELETE FROM Institution_details WHERE user_id = " + user_id;
    return sequelize.query(query, { type: sequelize.QueryTypes.DELETE});
  }

/** getWesData function to get the Data of wesApplication using StoreProcedure*/
  Institution_details.getWesData = async (appId,name,email,wesNo,limit,offset)=>{
     
    return sequelize.query('CALL sp_getWesApplication(:where_application_id,:where_name,:where_email,:where_wesNo,:limits ,:offsets)', {
      replacements: { 
        where_application_id: appId ? appId :  " ",
        where_name: name ? name : " ",
        where_email : email ? email : "",
        where_wesNo: wesNo ? wesNo : " ", 
        limits : limit  ? limit  : "", 
        offsets : offset ? offset :" "
    },
      type: sequelize.QueryTypes.RAW
  });
  }
  

  // Institution_details.hasMany(sequelize.models.Application);
  Institution_details.associate = (models) => {
    Institution_details.belongsTo(models.User, {foreignKey: 'user_id'});
  Institution_details.belongsTo(models.Application, {foreignKey: 'app_id'});

  };

  

return Institution_details;
};