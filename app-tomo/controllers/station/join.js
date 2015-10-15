var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, Station, Activity) {

  return function(req, res, next) {

    async.waterfall([

      function findStation(callback) {
        Station.findById(req.params.station, callback);
      },

      function findGroup(station, callback) {
        Group.findOne()
          .where('name').equals(station.name)
          .where('station').equals(station.id)
          .where('type').equals('station')
          .exec(function(err, group) {
            if (err) next(err);
            else callback(null, station, group);
          });
      },

      function createGroupIfNeeded(station, group, callback) {

        if (!group) {
          Group.create({
            type: 'station',
            name: station.name,
            station: station.id,
            coordinate: station.coordinate
          }, callback);
        } else callback(null, station, group);
      },

      function updateRelateInfo(station, group, callback) {

        async.parallel({

          user: function (callback) {
            User.findByIdAndUpdate(req.user.id, {
              $addToSet: {
                groups: group.id,
                stations: station.id
              }
            }, callback);
          },

          group: function(callback) {
            group.members.addToSet(req.user.id);
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
      }

    ], function(err, group, relateInfo) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
