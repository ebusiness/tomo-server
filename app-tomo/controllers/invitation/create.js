var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Activity, Invitation) {

  return function(req, res, next) {

    // TODO: check friend id is already in the 'friend' or 'invited' list

    async.waterfall([

      function createRelateInfo(callback) {

        async.parallel({

          user: function (callback) {
            req.user.invitations.addToSet(req.body.id);
            req.user.save(callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'friend-invited',
              targetUser: req.body.id
            }, callback);
          },

          invitation: function (callback) {
            Invitation.create({
              from: req.user.id,
              to: req.body.id,
              type: 'friend'
            }, callback);
          }

        }, callback);
      },

      function sendNotification(relateInfo, callback) {

        var alertMessage = req.user.nickName + "请求成为您的好友";
        var payload = {
          type: 'friend-invited',
          id: req.user.id
        }

        Push(req.user.id, req.body.id, payload, alertMessage, function(err, apnNotification){
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
