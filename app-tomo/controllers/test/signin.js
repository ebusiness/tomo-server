var async = require('async');

module.exports = function(User, Invitation, Message, Notification) {

  return function(req, res, next) {

    async.waterfall([

      function findUser(callback) {
        User.findById(req.query.id)
        .populate('primaryStation', 'name coordinate introduction')
        .exec(callback);
      },

      function findRelateInfo(user, callback) {

        if (user == null) {
          var err = new Error('Not Found');
          err.status = 404;
          callback(err);
        } else {

          // put user's id into session
          req.session.userId = user.id;

          async.parallel({

            invitation: function(callback) {
              Invitation.find()
                .where('to').equals(user.id)
                .where('type').equals('friend')
                .where('result').equals(null)
                .where('logicDelete').equals(false)
                .select('from type createDate')
                .populate('from', 'nickName photo')
                .exec(callback);
            },

            messages: function(callback) {
              Message.find()
                .select('from createDate')
                .where('to').equals(user.id)
                .where('from').in(user.friends)
                .where('opened').ne(user.id)
                .where('logicDelete').ne(user.id)
                .exec(callback);
            },

            notifications: function(callback) {
              Notification.count()
                .where('to').equals(user.id)
                .where('confirmed').ne(user.id)
                .where('logicDelete').equals(false)
                .exec(callback);
            }

          }, function(err, result) {
            if (err) callback(err);
            else {
              user = user.toObject();
              user.friendInvitations = result.invitation;
              user.newMessages = result.messages;
              user.notifications = result.notifications
              callback(null, user);
            }
          });

        }
      }

    ], function(err, user) {
      if (err) next(err);
      else res.json(user);
    });

  };
};
