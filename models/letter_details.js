
"use strict"

module.exports = function(sequelize, DataTypes) {
var letterDetails = sequelize.define("letter_details", {
    user_id: DataTypes.INTEGER,
    studentName: DataTypes.STRING(255),
    courseName: DataTypes.STRING(255),
    collegeName : DataTypes.STRING(255),
    specialization: DataTypes.STRING(255), 
    yearofpassing: DataTypes.STRING(255),
    duration: DataTypes.INTEGER,
    division: DataTypes.STRING(255), 
    education_type: DataTypes.STRING(255),
    faculty : DataTypes.STRING(255),
    type : DataTypes.STRING(255),
    app_id : DataTypes.INTEGER,
    lock_transcript : DataTypes.BOOLEAN(),
 });

 letterDetails.belongsTo(sequelize.models.Application, {foreignKey: 'app_id'});

 return letterDetails;
};