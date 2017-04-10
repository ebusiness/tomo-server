var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, Activity) {

  return function(req, res, next) {
    if (!req.params.group || !req.params.user) {
      res.status(412).end();
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.group)) {
      res.status(412).end();
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.status(412).end();
      return;
    }

    async.waterfall([

      function findGroup(callback) {
        Group.findById(req.params.group, callback);
      },

      function check(group, callback) {
        if(group.owner != req.user.id) {
          var err = new Error('Access Forbidden');
          err.status = 403;
          callback(err);
          return;
        }
        if(group.owner == req.params.user && group.members.length > 1) {
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
            User.findByIdAndUpdate(req.params.user, {
              $pull: {groups: req.params.group}
            }, callback);
          },

          group: function(callback) {
            group.members.pull(req.user.id);
            if(group.owner == req.params.user) {
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
        callback(null, group);
      }

    ], function(err, group) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
