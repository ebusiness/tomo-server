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
  PostReport = mongoose.model('PostReport'),
  UserReport = mongoose.model('UserReport'),
  Mailer = require('./mailer/mailer.js');

module.exports = function(app, config, sio) {

  // prepare controller
  var controller = prepareController(config.root + '/app-tomo/controllers');

  //////////////////////////////////////////////////
  /// User Account Relate
  //////////////////////////////////////////////////

  // Test Sign-in
  app.get('/signin-test', controller.test.signin(User, Invitation, Message, Notification));

  // User Sign-in
  app.post('/signin', controller.me.signin(User, Invitation, Message, Notification));
  // User Sign-up
  app.post('/signup', controller.tempaccount.create(TempAccount, User, Mailer));
  // Account activate
  app.get('/activate/:id', controller.tempaccount.activate(TempAccount, User, Mailer));

  // User Sign-up WeChat
  app.post('/signup-wechat', controller.me.signupWeChat(User, Activity));
  // User Sign-in WeChat
  app.post('/signin-wechat', controller.me.signinWeChat(User, Invitation, Message, Notification));

  // User Sign-out
  app.get('/signout', checkLoginStatus, controller.me.signout(User));

  // User Decive Register
  app.post('/device', checkLoginStatus, controller.me.device(User));

  // User Session
  app.get('/session', checkLoginStatus, controller.me.show(Invitation, Message, Notification));

  // User Profile Update
  app.patch('/me', checkLoginStatus, controller.me.update(User));

  //////////////////////////////////////////////////
  /// Post Relate
  //////////////////////////////////////////////////

  // Post List
  app.get('/posts', checkLoginStatus, controller.post.index(Post));
  // Post Create
  app.post('/posts', checkLoginStatus, controller.post.create(Post, Group, Activity, Notification));
  // Post Entity
  app.get('/posts/:post', checkLoginStatus, controller.post.show(Post));
  // Post of User
  app.get('/users/:user/posts', checkLoginStatus, controller.post.index(Post, User, Group));
  // Post of Group
  app.get('/groups/:group/posts', checkLoginStatus, controller.post.index(Post, User, Group));
  // Comment Post
  app.post('/posts/:post/comments', checkLoginStatus, controller.post.update(Post, Activity, Notification));
  // Like Post
  app.patch('/posts/:post/like', checkLoginStatus, controller.post.like(Post, Activity, Notification));
  // Bookmark Post
  app.patch('/posts/:post/bookmark', checkLoginStatus, controller.post.bookmark(User, Post, Activity, Notification));
  // Post Delete
  app.delete('/posts/:post', checkLoginStatus, controller.post.remove(Post));

  //////////////////////////////////////////////////
  /// Connection Relate
  //////////////////////////////////////////////////

  // Invitation List
  app.get('/invitations', checkLoginStatus, controller.invitation.index(User));
  // Invitation Create
  app.post('/invitations', checkLoginStatus, controller.invitation.create(Activity, Invitation));
  // Invitation Update
  app.patch('/invitations/:invitation', checkLoginStatus, controller.invitation.update(User, Activity, Invitation, Notification));
  // Friends List
  app.get('/friends', checkLoginStatus, controller.connection.friends(User, Message));
  // Friend Break
  app.delete('/friends/:friend', checkLoginStatus, controller.connection.remove(User, Message, Activity, Notification));
  // Toggle User Block
  app.post('/blocks', checkLoginStatus, controller.connection.block(Activity));
  // User Search
  app.get('/users', checkLoginStatus, controller.connection.discover(User));
  // User Profile
  app.get('/users/:user', checkLoginStatus, controller.user.show(User));

  //////////////////////////////////////////////////
  /// Group Relate
  //////////////////////////////////////////////////

  // Group List
  app.get('/groups', checkLoginStatus, controller.group.index(Group, Post));
  // Group Entity
  app.get('/groups/:group', checkLoginStatus, controller.group.show(Group));
  // Group Create
  app.post('/groups', checkLoginStatus, controller.group.create(Group, Activity));
  // Join Group
  app.patch('/groups/:group/join', checkLoginStatus, controller.group.join(User, Group, Activity));
  // Leave Group
  app.patch('/groups/:group/leave', checkLoginStatus, controller.group.leave(User, Group, Activity));

  //////////////////////////////////////////////////
  /// Message Relate
  //////////////////////////////////////////////////

  // Message List
  app.get('/contacts', checkLoginStatus, controller.connection.contacts(User, Group, Message));

  // Create Message for group
  app.post('/groups/:group/messages', checkLoginStatus, controller.group.createMessage(User, Group, Message, Activity, sio));
  // Chat Message of group
  app.get('/groups/:group/messages', checkLoginStatus, controller.group.messages(Message));

  // Latest messages list
  app.get('/messages', checkLoginStatus, controller.message.latest(User, Message))
  // Chat Message with some one
  app.get('/messages/:user', checkLoginStatus, controller.message.index(Message));
  // Chat Message Create
  app.post('/messages', checkLoginStatus, controller.message.create(User, Message, Activity, sio));

  //////////////////////////////////////////////////
  /// Notification Relate
  //////////////////////////////////////////////////

  // Notification List
  app.get('/notifications', checkLoginStatus, controller.notification.index(Notification));

  //////////////////////////////////////////////////
  /// Report Relate
  //////////////////////////////////////////////////
  // Report User
  app.post('/reports/users/:user', checkLoginStatus, controller.userreport.create(UserReport));
  // Report Post
  app.post('/reports/posts/:post', checkLoginStatus, controller.postreport.create(PostReport));
};

checkLoginStatus = function(req, res, next) {

  if (!req.session.userId) res.status(401).end();
  else {

    // find user by his id
    User.findById(req.session.userId)
      .select('-password -logicDelete')
      .populate('primaryStation', 'name coordinate introduction cover')
      .exec(function(err, user) {

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
