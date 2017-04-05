var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Company, Activity) {

  return function(req, res, next) {
    // req.body = req.query;
    if ( !req.body.name || !req.body.coordinate){
      res.status(412).end();
      return;
    }
    if ( !req.body.type ){
      req.body.type = "si";
    }

    req.body.owner = req.user.id;
    // req.body.members = [req.user.id];

    async.waterfall([
      function createCompany(callback) {
        Company.create(req.body, callback);
      },

      function createRelateInfo(company, callback) {
        callback(null, company);

        async.parallel({

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'company-new',
              relateCompany: company._id
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
