var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Group, Company, Project, Activity) {

  return function(req, res, next) {
    // req.body = req.query;

    if (!req.body.name) {
      res.status(412).end();
      return;
    }

    async.waterfall([
      function createGroup(callback) {
        req.body.owner = req.user.id;
        req.body.members = [req.user.id];
        Group.create(req.body, callback);
      },

      function createRelateInfo(group, callback) {
        async.parallel({

          user: function (callback) {
            req.user.groups.addToSet({group:group._id});
            req.user.save(callback);
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-new',
              targetGroup: group._id
            }, callback);
          }

        }, function(err, relateObj) {
            if (err) next(err);
            else callback(null, group);;
        });
      }

    ], function(err, group) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
