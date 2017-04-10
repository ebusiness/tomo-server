var fs = require('fs'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Post = mongoose.model('Post'),
  Company = mongoose.model('Company'),
  Project = mongoose.model('Project'),
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
  // User Sign-in WeChat (auto sign-up)
  app.post('/signin-wechat', controller.me.signinWeChat(User, Invitation, Message, Notification, Activity));

  // User Sign-out
  app.get('/signout', checkLoginStatus, controller.me.signout(User));

  // User Decive Register/Update
  app.put('/device', checkLoginStatus, controller.me.device(User));

  // User Session
  app.get('/session', checkLoginStatus, controller.me.show(Invitation, Message, Notification));

  // User Profile Update
  app.patch('/me', checkLoginStatus, controller.me.update(User));

  //////////////////////////////////////////////////
  /// Experience Relate
  //////////////////////////////////////////////////

  // 	Create/Update a Experience
  app.put('/experiences', checkLoginStatus, controller.me.experiences(User, Project));

  //////////////////////////////////////////////////
  /// Following Relate
  //////////////////////////////////////////////////

  // Add a user into Following
  app.post('/following/:user', checkLoginStatus, controller.connection.addFollowing(User));
  // Delete a user From Following
  app.delete('/following/:user', checkLoginStatus, controller.connection.delFollowing(User));
  // Following
  app.get('/following', checkLoginStatus, controller.connection.getFollowing(User));
  // Following
  app.get('/users/:user/following', checkLoginStatus, controller.connection.getFollowing(User));
  // followers
  app.get('/followers', checkLoginStatus, controller.connection.followers(User));
  // followers
  app.get('/users/:user/followers', checkLoginStatus, controller.connection.followers(User));

  //////////////////////////////////////////////////
  /// Company Relate
  //////////////////////////////////////////////////

  // Company List
  app.get('/companies', checkLoginStatus, controller.company.index(Company));
  // Company Entity
  app.get('/companies/:company', checkLoginStatus, controller.company.show(Company));
  // Company Create
  app.post('/companies', checkLoginStatus, controller.company.create(Company, Activity));

  //////////////////////////////////////////////////
  /// Project Relate
  //////////////////////////////////////////////////

  // Project List
  app.get('/projects', checkLoginStatus, controller.project.index(Project, Company, User));
  // Project Entity
  app.get('/projects/:project', checkLoginStatus, controller.project.show(Project));
  // Project Create
  app.post('/projects', checkLoginStatus, controller.project.create(Project, Activity));

  // Projects of some company
  app.get('/companies/:company/projects', checkLoginStatus, controller.project.index(Project, Company, User));
  // Projects of some user
  app.get('/users/:user/projects', checkLoginStatus, controller.project.index(Project, Company, User));

  //////////////////////////////////////////////////
  /// Connection Relate
  //////////////////////////////////////////////////
  // User Search
  app.get('/users/discover', checkLoginStatus, controller.connection.discover(User));
  // User Search
  app.get('/users', checkLoginStatus, controller.connection.index(User, Project, Company));
  // users of project
  app.get('/projects/:project/members', checkLoginStatus, controller.connection.index(User, Project, Company));
  // users of company
  app.get('/companies/:company/employees', checkLoginStatus, controller.connection.index(User, Project, Company));

  // User Profile
  app.get('/users/:user', checkLoginStatus, controller.user.show(User, Project));

  //////////////////////////////////////////////////
  /// Post Relate
  //////////////////////////////////////////////////

  // Post List
  app.get('/posts', checkLoginStatus, controller.post.index(Post));
  // Post Create
  app.post('/posts', checkLoginStatus, controller.post.create(Post, Project, Activity, Notification));
  // Post Entity
  app.get('/posts/:post', checkLoginStatus, controller.post.show(Post));
  // Comment Post
  app.post('/posts/:post/comments', checkLoginStatus, controller.post.update(Post, Activity, Notification));
  // Like Post
  app.patch('/posts/:post/like', checkLoginStatus, controller.post.like(Post, Activity, Notification));
  // Post Delete
  app.delete('/posts/:post', checkLoginStatus, controller.post.remove(Post));

  // Post of User
  app.get('/users/:user/posts', checkLoginStatus, controller.post.index(Post, User, Project, Company));
  // Post of Project
  app.get('/projects/:project/posts', checkLoginStatus, controller.post.index(Post, User, Project, Company));
  // Post of Company
  app.get('/companies/:company/posts', checkLoginStatus, controller.post.index(Post, User, Project, Company));

  //////////////////////////////////////////////////
  /// Group Relate
  //////////////////////////////////////////////////

  // Group List
  app.get('/groups', checkLoginStatus, controller.group.index(Group));
  // Group Entity
  app.get('/groups/:group', checkLoginStatus, controller.group.show(Group));
  // Group Create
  app.post('/groups', checkLoginStatus, controller.group.create(Group, Company, Project, Activity));
  // Group invitation
  app.patch('/groups/:group/invite/:user', checkLoginStatus, controller.group.invite(User, Group, Activity));
  // Leave Group
  app.patch('/groups/:group/leave', checkLoginStatus, controller.group.leave(User, Group, Activity));
  // Kickout User
  app.patch('/groups/:group/kickout/:user', checkLoginStatus, controller.group.kickout(User, Group, Activity));

  //////////////////////////////////////////////////
  /// Message Relate
  //////////////////////////////////////////////////


  // Latest messages list
  app.get('/messages', checkLoginStatus, controller.message.latest(User, Group, Message));

  // Chat Message with some one
  app.get('/users/:user/messages', checkLoginStatus, controller.message.index(Message));
  // Chat Message Create
  app.post('/users/:user/messages', checkLoginStatus, controller.message.create(User, Message, Activity, sio));

  // Chat Message of group
  app.get('/groups/:group/messages', checkLoginStatus, controller.group.messages(Message));
  // Create Message for group
  app.post('/groups/:group/messages', checkLoginStatus, controller.group.createMessage(User, Group, Message, Activity, sio));

  //////////////////////////////////////////////////
  /// Report Relate
  //////////////////////////////////////////////////
  // Toggle User Block
  app.post('/blocks', checkLoginStatus, controller.connection.block(Activity));
  // Report User
  app.post('/reports/users/:user', checkLoginStatus, controller.userreport.create(UserReport));
  // Report Post
  app.post('/reports/posts/:post', checkLoginStatus, controller.postreport.create(PostReport));




  //////////////////////////////////////////////////
  /// Notification Relate
  //////////////////////////////////////////////////

  // Notification List
  app.get('/notifications', checkLoginStatus, controller.notification.index(Notification));


  //////////////////////////////////////////////////
  /// Connection Relate
  //////////////////////////////////////////////////

  // // Invitation List
  // app.get('/invitations', checkLoginStatus, controller.invitation.index(User));
  // // Invitation Create
  // app.post('/invitations', checkLoginStatus, controller.invitation.create(Activity, Invitation));
  // // Invitation Update
  // app.patch('/invitations/:invitation', checkLoginStatus, controller.invitation.update(User, Activity, Invitation, Notification));
  // // Friends List
  // app.get('/friends', checkLoginStatus, controller.connection.friends(User, Message));
  // // Friend Break
  // app.delete('/friends/:friend', checkLoginStatus, controller.connection.remove(User, Message, Activity, Notification));

};

checkLoginStatus = function(req, res, next) {

  if (!req.session.userId) res.status(401).end();
  else {

    // find user by his id
    User.findById(req.session.userId)
      .select('-password -logicDelete')
      // .populate('followers', 'nickName photo')
      // .populate('following', 'nickName photo')
      .populate('experiences.project')
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
