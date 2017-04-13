var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Recruit, Activity) {

  return function(req, res, next) {
    // req.body = req.query;
    if (!req.body.name || !req.body.coordinate){
      res.status(412).end();
      return;
    }

    req.body.creator = req.user.id;
    if (!req.body.company) {
        req.body.company = req.user.company._id;
    }

    async.waterfall([
      function createProject(callback) {
        Recruit.create(req.body, callback);
      },

      function createRelateInfo(recruit, callback) {
        callback(null, recruit);

        async.parallel({

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'recruit-new',
              relateCompany: recruit._id
            }, callback);
          }

        }, function(err, result) {
          if (err) console.log("" + err);
        });
      }

    ], function(err, result) {
      if (err) next(err);
      else res.json(result);
    });

  };
};
