var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose');

module.exports = function(User, Group, Activity) {

  return function(req, res, next) {
    if (!req.body.user || !req.params.group) {
      res.status(412).end();
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.group)) {
      res.status(412).end();
      return;
    }

    async.waterfall([
      function findRelateInfo() {
          async.parallel({

            user: function (callback) {
              User.findById(req.body.user, callback);
            },

            group: function(callback) {
              Group.findById(req.params.group)
                .where('_id').in(req.user.groups)
                .where('logicDelete').equals(false)
                .exec(callback);
            }

          }, function(err, relateInfo) {
            if (err) {
              callback(err);
            } else if (relateInfo.group == null || relateInfo.user == null) {
              var err = new Error('Access Forbidden');
              err.status = 403;
              callback(err);
            } else {
              callback(null, relateInfo);
            }
          });
      },

      function updateRelateInfo(relateInfo, callback) {

        async.parallel({

          user: function (callback) {
            relateInfo.user.groups.addToSet(req.params.group);
            relateInfo.user.save(callback);
          },

          group: function(callback) {
            relateInfo.group.members.addToSet(req.body.user);
            relateInfo.group.save(callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-invitationed',
              relateUser: req.body.user,
              relateGroup: req.params.group
            }, callback);
          }

        }, function(err, relateInfo) {
          if (err) callback(err);
          else callback(null, relateInfo);
        });
      },

      function sendNotification(relateInfo, callback) {
        var alertMessage = req.user.nickName + "邀请您, 加入了[" + relateInfo.group.name + "]";
        var payload = {
          type: 'group-invitationed',
          from: {
            id:       req.user.id,
            nickName: req.user.nickName,
            photo:    req.user.photo,
            cover:    req.user.cover
          },
          targetId: relateInfo.group.id
        }

        Push(req.user.id, req.body.user, payload, alertMessage, function(err, apnNotification){
          console.log("======== apn callback ========");
          console.log(arguments);
          console.log("======== apn callback ========");
          if (err) next(err);
        });

        callback(null, relateInfo);
      }

    ], function(err, relateInfo) {
      if (err) next(err);
      else res.json(relateInfo.group);
    });

  };
};
