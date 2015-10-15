var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, Station, Activity) {

  return function(req, res, next) {
    async.waterfall([

      function findStation(callback) {
        Station.find()
          .where('_id').in(req.query.stations)
          .exec(function(err, stations) {
            if (err) next(err);
            else if (stations.length > 0) callback(null, stations);
            else json.status(403).end();
          });
      },
      function findGroup(stations, callback) {
        Group.find()
          .where('station').in(stations)
          .where('type').equals('station')
          .exec(function(err, groups) {
            if (err) next(err);
            else callback(null, stations, groups);
          })
      },
      function updateRelateInfo(stations, groups, callback) {
        async.parallel({

          user: function (callback) {
            if (groups && groups.length > 0){
              groups.forEach(function(group){
                req.user.groups.pull(group.id);
                group.members.pull(req.user.id);
                group.save();
              });
            }
            if (stations && stations.length > 0){
              stations.forEach(function(station){
                req.user.stations.pull(station.id);
              });
            }
            req.user.save(callback);
          },

          activity: function (callback) {
            if (groups && groups.length > 0){
              groups.forEach(function(group){
                Activity.create({
                  owner: req.user.id,
                  type: 'group-left',
                  targetGroup: group.id
                }, callback);
              });
            }
          }

        }, function(err, relateInfo) {
          if (err) callback(err);
          else callback(null, relateInfo);
        });
      }

    ], function(err, relateInfo) {
      console.log(relateInfo);
      if (err) next(err);
      else res.json(req.user);
    });
  };
};
