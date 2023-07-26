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
    getUserInfo:async function(req, res, next){ 
        if (req.headers.authorization) { 
            try {
              const token = req.headers.authorization.split(' ')[1];  //remove the bearer 
              const decoded = jwtorig.verify(token, cfg.jwtSecret); 
              req.user_id = decoded.id; 
        
              const User = await models.User.findOne({
                where: {
                  id: req.user_id
                }
              });
              req.User = User;
              next();
            } catch (error) { 
              console.error("Token verification failed:", error);
              res.json({ 
                status:401,
                error: "Invalid or expired token."
             });
            }
          } else {
            req.User = null;
            req.sendGuardianEmail = false;
            req.User_Guardian = null;
            next();
          }
      },
}