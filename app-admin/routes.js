var fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Mailer = require('./mailer/mailer.js');

module.exports = function(app, config) {

  // prepare controller
  var controller = prepareController(config.root + '/app-admin/controllers');
  var cmnController = prepareController(config.root + '/controllers');

  //////////////////////////////////////////////////
  /// Static route
  //////////////////////////////////////////////////
  // Home page
  app.get('/', function(req, res, next) {
    res.render('home');
  });

  // Resource download
  app.get('/resource/:file', function(req, res, next) {

    var options = {
      root: GLOBAL.config.root + '/resource/',
    };

    res.sendFile(req.params.file, options, function(err) {
      if (err) res.status(err.status).end();
    });
  });

  //////////////////////////////////////////////////
  /// Main route
  //////////////////////////////////////////////////

};

checkLoginStatus = function(req, res, next) {

  if (!req.session.userId) res.status(401).end();
  else {

    // find user by his id
    User.findById(req.session.userId, function(err, user) {

      if (!err && user) {
        // associate user with request
        req.user = user;
        next();
      } else {
        next(new Error('Could not restore User from Session.'));
      }
    });
  }
};

prepareController = function(path) {

  // prepare controller
  var controller = {},
    pattern = /(.*)?\.js/;

  // open the controller path, loop through the contents
  fs.readdirSync(path).forEach(function(dir) {

    // get stats object of a dir/file
    var stats = fs.statSync(path + '/' + dir);

    // if encounter a dir
    if (stats.isDirectory()) {

      // create controller sub categroy
      controller[dir] = {};

      // then loop through the dir
      fs.readdirSync(path + '/' + dir).forEach(function(file) {

        // if encounter a .js file
        if (~file.indexOf('.js') && file) {

          // load this file as request handler
          var match = pattern.exec(file);
          controller[dir][match[1]] = require(path + '/' + dir + '/' + file);
        }
      });
    }
  });

  return controller;
};
