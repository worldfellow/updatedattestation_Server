var jwtorig = require('jsonwebtoken');
var models  = require('./models');
var _ = require('lodash');
var cfg = require('./auth/config.js');
var path = require('path');
var root_path = path.dirname(require.main.filename);
var constant = require(root_path+'/config/constant');
var request = require('request');
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = {
    getUserInfo: function(req, res, next){
        if (req.headers.authorization) {
            var token =req.headers.authorization
            decoded = jwtorig.verify(token, cfg.jwtSecret);
            req.user_id = decoded.id;
            models.User.find({
                where:{
                    id : req.user_id
                }
            }).then(function(User){
                req.User = User;
                next();
             });
       
        }else{
            req.User = null;
            req.sendGuardianEmail = false; 
            //req.User_Guardian = User_Guardian;
            req.User_Guardian = null;
            next();
        }
      },
}