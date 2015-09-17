var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Group, Activity) {

  return function(req, res, next) {

    async.waterfall([

      function findGroup(callback) {
        Group.findById(req.params.group, callback);
      },

      function updateRelateInfo(group, callback) {

        async.parallel({

          user: function (callback) {
            req.user.groups.addToSet(req.body.id);
            req.user.save(callback);
          },

          group: function(callback) {
            group.members.addToSet(req.body.id);
            group.save(callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-joined',
              targetGroup: group.id
            }, callback);
          }

        }, function(err, relateInfo) {
          if (err) callback(err);
          else callback(null, group, relateInfo);
        });
      },

      function sendNotification(group, relateInfo, callback) {

        if (group.owner) {
          var alertMessage = req.user.nickName + "加入了" + group.name;
          var payload = {
            type: 'group-joined',
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo,
              cover:    req.user.cover
            },
            targetId: group.id
          }

          Push(req.user.id, group.owner, payload, alertMessage, function(err, apnNotification){
            console.log("======== apn callback ========");
            console.log(arguments);
            console.log("======== apn callback ========");
            if (err) next(err);
          });
        }

        callback(null, group);
      }

    ], function(err, group) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
