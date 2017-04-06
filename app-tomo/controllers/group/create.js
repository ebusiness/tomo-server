var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Group, Company, Activity) {

  return function(req, res, next) {
    // req.body = req.query;

    if ( !req.body.name || !req.body.coordinate){
      res.status(412).end();
      return;
    }

    var ids = []
    if (req.body.companies.si) {
      ids = ids.concat(req.body.companies.si);
    }
    if (req.body.companies.end) {
      ids = ids.concat(req.body.companies.end);
    }
    if (ids.length == 0) {
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
        callback(null, group);
        async.parallel({

          user: function (callback) {
            req.user.groups.addToSet({group:group._id});
            req.user.save(callback);
          },

          cmpanies: function(callback) {
            Company
              .where({'_id': {'$in': ids}})
              .setOptions({ multi: true })
              .update({ '$addToSet': { 'groups': group._id } }, function(err, companies) {
                console.log(companies);
              });
          },

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'group-new',
              targetGroup: group._id
            }, callback);
          }

        });
      }

    ], function(err, group) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
