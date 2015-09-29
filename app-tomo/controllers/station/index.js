var async = require('async'),
    moment = require('moment');

module.exports = function(Station) {

  return function(req, res, next) {

    async.waterfall([

      function findStations(callback) {

        // create query
        var query = Station.find();

        // stations near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate,
            // maxDistance: 1/111.12
          });

        // stations in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

        // station name match some string
        if (req.query.name)
          query.where('name').regex('^.*'+req.query.name+'.*$')

        if (req.query.page)
          query.skip(20 * req.query.page)

        query.select('name line coordinate color')
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