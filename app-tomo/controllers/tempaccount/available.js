var async = require('async');

module.exports = function(TempAccount, User) {

  return function(req, res, next) {

    async.waterfall([

      function checkTempAccount(callback) {

        TempAccount.findOne({
          email: req.body.email
        }, function(err, account) {

          if (err) callback(err);
          else if (account) {
            var err = new Error();
            err.status = 409;
            callback(err);
          } else callback(null);
        });
      },

      function checkUserAccount(callback) {

        User.findOne({
          email: req.body.email
        }, function(err, account) {
          if (err) callback(err);
          else if (account) {
            var err = new Error();
            err.status = 409;
            callback(err);
          } else callback(null);
        });
      },

      function checkCompanyAccount(callback) {

        Company.findOne({
          email: req.body.email
        }, function(err, account) {
          if (err) callback(err);
          else if (account) {
            var err = new Error();
            err.status = 409;
            callback(err);
          } else callback(null);
        });
      }

    ], function(err, result) {

      if (err && err.status != 409) next(err);
      else if (err) res.status(409).end();
      else res.json({});
    });

  };

};
