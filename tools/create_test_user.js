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

function fetch() {

  User.find().exec(function(err, users) {

    var count = 1;

    users.forEach(function(user) {

      setTimeout(function(){
        request("https://randomuser.me/api/", {timeout: 10000, pool: false, json: 'body'}, function(err, msg, body) {
          console.log(body.results[0].user.username)
          user.photo = body.results[0].user.picture.large
          user.nickName = body.results[0].user.username
          user.save();
        });
      }, count * 2000);

      count++;
    });
  });

}

fetch();
