"use strict";

module.exports = function(sequelize, DataTypes) {
  var Purpose_List = sequelize.define("Purpose_List", {
    name : DataTypes.STRING(255),
    created_at : DataTypes.DATE,
    allRefNo : DataTypes.BOOLEAN(),
    wesEmail : DataTypes.BOOLEAN(),
    wesName : DataTypes.BOOLEAN(),
    wesSurname : DataTypes.BOOLEAN(),
    allUniversityCompanyName : DataTypes.BOOLEAN(),
    allName : DataTypes.BOOLEAN(),
    allCountryName : DataTypes.BOOLEAN(),
    allContactPersonName : DataTypes.BOOLEAN(),
    allContactNo : DataTypes.BOOLEAN(),
    allEmail : DataTypes.BOOLEAN(),
    email : DataTypes.STRING(255),
    scholarship : DataTypes.BOOLEAN(),
  });

  Purpose_List.getPurposeList = function() {
    var query = '';
    query += " SELECT * FROM purpose_list ";
    return sequelize.query(query, { type: sequelize.QueryTypes.SELECT});
  };
  return Purpose_List;
};
