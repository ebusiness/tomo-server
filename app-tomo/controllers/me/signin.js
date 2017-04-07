var async = require('async');

module.exports = function(User, Invitation, Message, Notification) {

  return function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password) {
      var err = new Error('Invalid Parameter');
      err.status = 412;
      next(err);
      return;
    }

    async.waterfall([

      function(callback) {
        User.findOne(req.body)
          .select('-password -logicDelete')
          // .populate('followers', 'nickName photo')
          // .populate('following', 'nickName photo')
          .populate('experiences.project')
          .where('logicDelete').equals(false)
          .exec(callback);
      },

      function(user, callback) {

        if (user == null) {
          var err = new Error('User Not Found');
          err.status = 404;
          callback(err);
        } else {

          // put user's id into session
          req.session.userId = user.id;
          callback(null, user);

          // async.parallel({
          //
          //   invitation: function(callback) {
          //     Invitation.find()
          //       .where('to').equals(user.id)
          //       .where('type').equals('friend')
          //       .where('result').equals(null)
          //       .where('logicDelete').equals(false)
          //       .select('from type createDate')
          //       .populate('from', 'nickName photo')
          //       .exec(callback);
          //   },
          //
          //   messages: function(callback) {
          //     var groupIds = [];
          //     if(user.groups && user.groups.length > 0){
          //       user.groups.forEach(function(group){
          //         groupIds.push(group.group._id)
          //       });
          //     }
          //     Message.find()
          //       .select('from group createDate')
          //       .or([
          //         {'group': {$in: groupIds}},
          //         {$and: [
          //           {'to': user.id},
          //           {'from': {$in: user.friends}}
          //         ]}
          //       ])
          //       // .where('to').equals(user.id)
          //       // .where('from').in(user.friends)
          //       .where('opened').ne(user.id)
          //       .where('logicDelete').ne(user.id)
          //       .exec(callback);
          //   },
          //
          //   notifications: function(callback) {
          //     Notification.count()
          //       .where('to').equals(user.id)
          //       .where('confirmed').ne(user.id)
          //       .where('logicDelete').equals(false)
          //       .exec(callback);
          //   }
          //
          // }, function(err, result) {
          //   if (err) callback(err);
          //   else {
          //     user = user.toObject();
          //     user.friendInvitations = result.invitation;
          //     user.newMessages = result.messages;
          //     user.notifications = result.notifications
          //     callback(null, user);
          //   }
          // });
        }
      }

    ], function(err, user) {
      if (err) next(err);
      else res.json(user);
    });

  };
};
