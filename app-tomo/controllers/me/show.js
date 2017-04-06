var async = require('async');

module.exports = function(Invitation, Message, Notification) {

  return function(req, res, next) {

    async.parallel({

      invitation: function(callback) {
        Invitation.find()
          .where('to').equals(req.user.id)
          .where('type').equals('friend')
          .where('result').equals(null)
          .where('logicDelete').equals(false)
          .select('from type createDate')
          .populate('from', 'nickName photo')
          .exec(callback);
      },

      messages: function(callback) {
        var groupIds = [];
        if(req.user.groups && req.user.groups.length > 0){
          req.user.groups.forEach(function(group){
            groupIds.push(group.group._id)
          });
        }
        Message.find()
          .select('from group createDate')
          .or([
            {'group': {$in: groupIds}},
            {$and: [
              {'to': req.user.id},
              {'from': {$in: req.user.friends}}
            ]}
          ])
          // .where('to').equals(req.user.id)
          // .where('from').in(req.user.friends)
          .where('opened').ne(req.user.id)
          .where('logicDelete').ne(req.user.id)
          .exec(callback);
      },

      notifications: function(callback) {
        Notification.count()
          .where('to').equals(req.user.id)
          .where('confirmed').ne(req.user.id)
          .where('logicDelete').equals(false)
          .exec(callback);
      }

    }, function(err, result) {
      if (err) next(err);
      else {
        var user = req.user.toObject();
        user.friendInvitations = result.invitation;
        user.newMessages = result.messages;
        user.notifications = result.notifications
        res.json(user);
      }
    });

  };

};
