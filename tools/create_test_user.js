var env = process.env.NODE_ENV || 'development',
  config = require('../config/global')[env],
  fs = require('fs'),
  async = require('async'),
  moment = require('moment'),
  request = require('request'),
  mongoose = require('mongoose');

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

var User = mongoose.model('User');
var Project = mongoose.model('Project');

function fetch() {

  var count = 1;
  for (var i = 0; i < 2000; i++) {
    setTimeout(function(){
      request("https://randomuser.me/api/", {timeout: 10000, pool: false, headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
        'accept': 'text/json,application/json'
      }}, function(err, msg, body) {
        var info = JSON.parse(body);

        var result = info.results[0];
        var userInfo = {};
        userInfo.type = "user";
        userInfo.email = result.email;
        userInfo.password = "1";
        userInfo.firstName = result.name.first;
        userInfo.lastName = result.name.last
        userInfo.nickName = result.login.username;
        userInfo.gender = result.gender == "male" ? "男" : "女";
        // userInfo.experiences = "user";
        userInfo.experiences = [];
        var random = Math.floor((Math.random() * 100));

        Project.find().skip(random).limit(1).exec(function(err, projects) {
            projects.forEach(function(project) {
                userInfo.experiences.push({
                  "from": project.startDate,
                  "to": project.endDate,
                  "company": project.relCompanies[0],
                  "project": project._id,
                });
                User.create(userInfo, function(err, user) {
                  console.log("created");
                });
            });
        });
        // console.log(body.results[0].user.username)
        // user.photo = body.results[0].user.picture.large
        // user.nickName = body.results[0].user.username
        // user.save();
      });
    }, count * 2000);
    count++;
  }

}

fetch();
