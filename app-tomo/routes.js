var fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Group = mongoose.model('Group'),
  Message = mongoose.model('Message'),
  Activity = mongoose.model('Activity'),
  Invitation = mongoose.model('Invitation'),
  Notification = mongoose.model('Notification'),
  TempAccount = mongoose.model('TempAccount'),
  ResetPassword = mongoose.model('ResetPassword'),
  Mailer = require('./mailer/mailer.js');

module.exports = function(app, config, sio) {

  // prepare controller
  var controller = prepareController(config.root + '/app-tomo/controllers');

  //////////////////////////////////////////////////
  /// User Account Relate
  //////////////////////////////////////////////////

  // Test Sign-in
  app.get('/signin-test', controller.test.signin(User, Invitation, Message));

  // User Sign-in
  app.post('/signin', controller.me.signin(User, Invitation, Message));
  // User Sign-up
  app.post('/signup', controller.tempaccount.create(TempAccount, User, Mailer));
  // Account activate
  app.get('/activate/:id', controller.tempaccount.activate(TempAccount, User, Mailer));

  // User Sign-up WeChat
  app.post('/signup-wechat', controller.me.signupWeChat(User, Activity)); // /mobile/user/regist
  // User Sign-in WeChat
  app.post('/signin-wechat', controller.me.signinWeChat(User, Invitation, Message));  // /mobile/user/openid

  // User Sign-out
  app.get('/signout', checkLoginStatus, controller.me.signout(User));

  // User Decive Register
  app.post('/device', checkLoginStatus, controller.me.device(User));  // /mobile/user/device

  // User Profile
  // app.get('/me', checkLoginStatus, controller.me.show(User));
  // User Profile Update
  app.patch('/me', checkLoginStatus, controller.me.update(User));  // /users/:id

  //////////////////////////////////////////////////
  /// Post Relate
  //////////////////////////////////////////////////

  // Post List
  app.get('/posts', checkLoginStatus, controller.post.index(Post));  // /newsfeed /mapnews /posts /bookmark
  // Post Create
  app.post('/posts', checkLoginStatus, controller.post.create(Post, Activity, Notification));  // /mobile/posts
  // Post Entity
  app.get('/posts/:post', checkLoginStatus, controller.post.show());  // /posts/\(id)
  // Post of User
  app.get('/users/:user/posts', checkLoginStatus, controller.post.index(Post, User));  // /users/:id/posts  ??
  // Comment Post
  app.post('/posts/:post/comments', checkLoginStatus, controller.post.update(Post, Activity, Notification));  // /posts/\(self.post.id)/comments
  // Like Post
  app.patch('/posts/:post/like', checkLoginStatus, controller.post.like(Post, Activity, Notification));  // /posts/\(self.post.id)/like
  // Bookmark Post
  app.patch('/posts/:post/bookmark', checkLoginStatus, controller.post.bookmark(User, Post, Activity, Notification));  // /posts/\(self.post.id)/bookmark
  // Post Delete
  app.delete('/posts/:post', checkLoginStatus, controller.post.remove(Post));  // /posts/\(self.post.id)

  //////////////////////////////////////////////////
  /// Group Relate
  //////////////////////////////////////////////////
  // Group List
  app.get('/groups', checkLoginStatus, controller.group.index(Group));
  // Group Create
  app.post('/groups', checkLoginStatus, controller.group.create(Group, Activity));

  //////////////////////////////////////////////////
  /// Message Relate
  //////////////////////////////////////////////////

  // Chat Message with some one
  app.get('/messages/:user', checkLoginStatus, controller.message.index(Message));  // /chat/:userId
  // Chat Message Create
  app.post('/messages', checkLoginStatus, controller.message.create(User, Message, Activity, sio));  // /messages

  //////////////////////////////////////////////////
  /// Notification Relate
  //////////////////////////////////////////////////

  // Notification List
  app.get('/notifications', checkLoginStatus, controller.notification.index(Notification));  // /mobile/notifications  /notifications/unconfirmed
  //
  // app.put('/notifications', checkLoginStatus, controller.notification.update());  // /mobile/notifications/open (patch)

  //////////////////////////////////////////////////
  /// Connection Relate
  //////////////////////////////////////////////////

  // Invitation List
  app.get('/invitations', checkLoginStatus, controller.invitation.index(User));  // /mobile/user/invited  ??
  // Invitation Create
  app.post('/invitations', checkLoginStatus, controller.invitation.create(Activity, Invitation));  // /connections/invite  ??
  // Invitation Update
  app.patch('/invitations/:invitation', checkLoginStatus, controller.invitation.update(User, Activity, Invitation, Notification));  // /notifications/\(invitation.id)  /notifications/\(id)
  // Friends List
  app.get('/friends', checkLoginStatus, controller.connection.friends(User, Message));  // /connections/friends  ??
  // Friend Break
  app.delete('/friends/:friend', checkLoginStatus, controller.connection.remove(User, Activity, Notification));  // /connections/break  ??
  // User Search
  app.get('/users', checkLoginStatus, controller.connection.discover(User));  // /mobile/stations/users
  // User Profile
  app.get('/users/:user', checkLoginStatus, controller.user.show(User));  // /users/\(id)

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
        var err = new Error('Could not restore User from Session.');
        err.status = 401
        next(err);
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
