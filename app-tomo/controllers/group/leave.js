var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, Activity) {

  return function(req, res, next) {
    if (!req.params.group) {
      res.status(412).end();
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.group)) {
      res.status(412).end();
      return;
    }

    async.waterfall([

      function findGroup(callback) {
        Group.findById(req.params.group, callback);
      },

      function check(group, callback) {
        if(group.owner == req.user.id && group.members.length > 1) {
          var err = new Error('Precondition Failed');
          err.status = 412;
          callback(err);
          return;
        }
        callback(null, group);
      },

      function updateRelateInfo(group, callback) {

        async.parallel({

          user: function (callback) {
            User.findByIdAndUpdate(req.user.id, {
              $pull: {groups: req.params.group}
            }, callback);
          },

          group: function(callback) {
            group.members.pull(req.user.id);
            if(group.owner == req.user.id) {
              group.owner = null;
            }
            group.save(callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-left',
              relateGroup: group.id
            }, callback);
          }

        }, function(err, relateInfo) {
          if (err) callback(err);
          else callback(null, group, relateInfo);
        });
      },

      function sendNotification(group, relateInfo, callback) {

        if (group.owner && group.owner != req.user.id) {
          var alertMessage = req.user.nickName + "退出了" + group.name;
          var payload = {
            type: 'group-left',
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
