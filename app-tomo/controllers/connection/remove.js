var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Activity, Notification) {

  return function(req, res, next) {

    // TODO: check friend id is already in the 'friend' or 'invited' list

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

    }, function(err, results) {
      if (err) next(err);
      else res.json({});
    });

  };
};
