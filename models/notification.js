"use strict";
  
module.exports = function (sequelize, DataTypes) {
	const Notifications = sequelize.define("Notifications", {
      message:DataTypes.STRING(255),
      read:{
        type:DataTypes.ENUM('true','false'),
        defaultValue: 'false'
      },
      user_id:DataTypes.INTEGER(255),
      action:DataTypes.STRING(255),
	});



	return Notifications;
};