var fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Notification = mongoose.model('Notification'),
  TempAccount = mongoose.model('TempAccount'),
  ResetPassword = mongoose.model('ResetPassword'),
  Mailer = require('./mailer/mailer.js');

module.exports = function(app, config) {

  // prepare controller
  var controller = prepareController(config.root + '/app-tomo/controllers');
  // var cmnController = prepareController(config.root + '/controllers');

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
  // Test account availability
  app.post('/available', controller.tempaccount.available(TempAccount, User));
  // User sign-up
  app.post('/signup', controller.tempaccount.create(TempAccount, User, Mailer));
  // Account activate
  app.get('/activate/:id', controller.tempaccount.activate(TempAccount, User, Mailer));

  // Retrieve password request
  app.post('/retrieve', controller.resetpassword.create(ResetPassword, User, Mailer));
  // Retrieve password page
  app.get('/retrieve/:id', controller.resetpassword.show(ResetPassword));
  // Reset password
  app.put('/retrieve/:id', controller.resetpassword.update(ResetPassword, User));

  // User Login
  app.post('/login', controller.me.login(User));
  // User Logout
  app.get('/logout', controller.me.logout());
  // User Information
  app.get('/session', controller.me.session(User));

  // User entity
  app.get('/me', checkLoginStatus, controller.me.show(User));
  // User profile update (Should be put)
  app.post('/me', checkLoginStatus, controller.me.update(User));
  // User photo update (Should be put)
  app.post('/me/photo', checkLoginStatus, controller.me.photo(User));

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
