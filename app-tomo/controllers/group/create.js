var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Group, Activity) {

  return function(req, res, next) {

    async.waterfall([

      function createRelateInfo(callback) {

        async.parallel({

          user: function (callback) {
            req.user.groups.addToSet(req.body.id);
            req.user.save(callback);
          },

          group: function(callback) {
            req.body.owner = req.user.id;
            req.body.members = [req.user.id];
            Group.create(req.body, callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-new',
              targetGroup: req.body.id
            }, callback);
          }

        }, callback);
      },

      function sendNotification(relateInfo, callback) {

        // var alertMessage = req.user.nickName + "请求成为您的好友";
        // var payload = {
        //   type: 'friend-invited',
        //   from: {
        //     id:       req.user.id,
        //     nickName: req.user.nickName,
        //     photo:    req.user.photo_ref,
        //     cover:    req.user.cover_ref
        //   },
        //   targetId: relateInfo.invitation._id
        // }
        //
        // Push(req.user.id, req.body.id, payload, alertMessage, function(err, apnNotification){
        //   console.log("======== apn callback ========");
        //   console.log(arguments);
        //   console.log("======== apn callback ========");
        //   if (err) next(err);
        // });

        callback(null, relateInfo);
      }

    ], function(err, result) {
      if (err) next(err);
      else res.json(result.group);
    });

  };
};
