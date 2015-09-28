var async = require('async'),
    moment = require('moment');

module.exports = function(Station) {

  return function(req, res, next) {

    async.waterfall([

      function findStations(callback) {

        // create query
        var query = Station.find();

        // station near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate,
            // maxDistance: 1/111.12
          });

        // station name match some string
        if (req.query.name)
          query.where('name').regex('^'+req.query.name+'$')

        if (req.query.page)
          query.skip(20 * req.query.page)

        query.select('name line coordinate')
          .where('_id').nin(req.user.stations)
          .limit(req.query.size || 20)
          .exec(callback);
      }

    ], function(err, stations) {
      if (err) next(err);
      else if (stations.length === 0) {
        var err = new Error('All Station Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(stations);
      }
    });

  };
};
