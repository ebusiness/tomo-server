var env = process.env.NODE_ENV || 'development',
  config = require('../config/global')[env],
  fs = require('fs'),
  async = require('async'),
  moment = require('moment'),
  mongoose = require('mongoose');

global.config = config;

  // Connect to MongoDB
  mongoose.connect(config.mongodb.host);
  mongoose.connection.on('open', function() {
    if ('production' !== config.app.env) mongoose.set('debug', true);
    console.log("DataBase " + config.mongodb.host + " connected.");
  });

  // Load MongoDB models
  var models_path = config.root + '/models';
  fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file);
  });

var User = mongoose.model('User'),
  Company = mongoose.model('Company'),
  Project = mongoose.model('Project'),
  Recruit = mongoose.model('Recruit');

for (var i = 0; i < 2000; i++) {
  async.waterfall([

    function count(callback) {

      async.parallel({

        user: function(callback) {
          User.count(callback);
        },

        project: function(callback) {
          Project.count(callback);
        }

      }, callback);
    },

    function relateInfo(count, callback) {

      async.parallel({

        user: function(callback) {
          var random = Math.floor((Math.random() * count.user));
          User.find().skip(random).limit(1).exec(callback)
        },

        project: function(callback) {
          var random = Math.floor((Math.random() * 50));
          Project.find()
            .skip(random).limit(1).exec(callback)
        }

      }, callback);

    }], function(err, relate) {
      // console.log(relate);
      Recruit.create({
          creator: relate.user[0]._id,
          name: relate.project[0].name,
          endUser: relate.project[0].endUser,
          company: relate.project[0].relCompanies && relate.project[0].relCompanies.length ? relate.project[0].relCompanies[0] : null,
          startDate: relate.project[0].startDate,
          endDate: relate.project[0].endDate,
          coordinate: relate.project[0].coordinate,
          introduction: relate.project[0].introduction,
      }, function(err, recruit) {
        console.log(err);
        console.log("over");
      });
    });
}
