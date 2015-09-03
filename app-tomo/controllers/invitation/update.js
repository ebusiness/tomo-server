var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Activity, Invitation, Notification) {

  return function(req, res, next) {

    if (!req.body.result) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
      return;
    }

    Invitation.findOne({
      _id: req.params.invitation,
      to: req.user.id
    }, function(err, invitation) {

      if (err) next(err);

      else if (invitation.type == 'friend' && req.body.result == "accept")
        acceptFriendInvitation(req, res, next, invitation)

      else if (invitation.type == 'friend' && req.body.result == "refuse" )
        refuseFriendInvitation(req, res, next, invitation)

      else {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      }

    });

  };

  function acceptFriendInvitation(req, res, next, invitation) {

    async.waterfall([

      function updateRelateInfo(callback) {

        async.parallel({

          me: function(callback) {

            // remove the request sender's id from user's invited list
            // (in case they invited each other)
            req.user.invitations.pull(invitation.from);
            // add the request sender's id into user's friend list
            req.user.friends.addToSet(invitation.from);

            req.user.save(callback);
          },

          friend: function(callback) {
            // find that friend, add current user to his friend list
            User.findByIdAndUpdate(invitation.from, {
              '$pull': {invitations: req.user.id},
              '$push': {friends: req.user.id},
            }, callback);
          },

          invitation: function(callback) {
            // mark the invitation as accept
            invitation.result = req.body.result;
            invitation.save(callback);
          },

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'friend-approved',
              targetUser: invitation.from
            }, callback);
          },

          notification: function(callback) {
            Notification.create({
              from: req.user.id,
              to: invitation.from,
              type: 'friend-approved'
            }, callback);
          }

        }, callback);
      },

      function sendNotification(relateInfo, callback) {

        var alertMessage = req.user.nickName + "已成为您的好友";
        var payload = {
          type: 'friend-approved',
          id: req.user.id
        };

        Push(req.user.id, invitation.from, payload, alertMessage, function(err, apnNotification){
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

  function refuseFriendInvitation(req, res, next, invitation) {

    async.waterfall([

      function updateRelateInfo(callback) {

        async.parallel({

          friend: function(callback) {
            // remove user's id from request sender's invited list
            User.findByIdAndUpdate(invitation.from, {
              '$pull': {invitations: req.user.id}
            }, callback);
          },

          invitation: function(callback) {
            // mark the invitation as refuse
            invitation.result = req.body.result;
            invitation.save(callback);
          },

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'friend-declined',
              targetUser: invitation.from
            }, callback);
          },

          notification: function(callback) {
            Notification.create({
              from: req.user.id,
              to: invitation.from,
              type: 'friend-declined'
            }, callback);
          }

        }, callback);
      },

      function sendNotification(relateInfo, callback) {

        var alertMessage = req.user.nickName + "拒绝了您的好友邀请";
        var payload = {
          type: 'friend-declined',
          id: req.user.id
        };

        Push(req.user.id, invitation.from, payload, alertMessage, function(err, apnNotification){
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
