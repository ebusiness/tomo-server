var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Message, Activity, Notification) {

  return function(req, res, next) {

    // TODO: check friend id is already in the 'friend' or 'invited' list

    async.waterfall([

      function updateRelateInfo(callback) {

        async.parallel({

          me: function(callback) {
            // remove the friend's id from user's friend list
            req.user.friends.pull(req.params.friend);
            req.user.save(callback);
          },

          friend: function(callback) {
            // find that friend, remove current user from his friend list
            User.findByIdAndUpdate(req.params.friend, {'$pull': {friends: req.user.id}}, callback);
          },

          messages: function(callback) {
            Message.where('from').equals(req.params.friend)
              .where('to').equals(req.user.id)
              .where('opened').equals(false)
              .where('logicDelete').equals(false)
              .setOptions({ multi: true })
              .update({opened: true}, callback);
          },

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'friend-break',
              targetUser: req.params.friend
            }, callback);
          },

          notification: function(callback) {
            Notification.create({
              from: req.user.id,
              to: req.params.friend,
              type: 'friend-break'
            }, callback);
          }
        }, callback);
      },

      function sendNotification(relateInfo, callback) {

        var alertMessage = req.user.nickName + "解除了与您的好友关系";
        var payload = {
          type: 'friend-break',
          from: {
            id:       req.user.id,
            nickName: req.user.nickName,
            photo:    req.user.photo_ref,
            cover:    req.user.cover_ref
          }
        }

        Push(req.user.id, req.params.friend, payload, alertMessage, function(err, apnNotification){
          console.log("======== apn callback ========");
          console.log(arguments);
          console.log("======== apn callback ========");
          if (err) next(err);
        });

        callback(null, relateInfo);
      }

    ], function(err, result) {
      if (err) next(err);
      else res.json({});
    });

  };
};
