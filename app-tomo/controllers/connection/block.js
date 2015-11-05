var async = require('async');

module.exports = function(Activity) {

  return function(req, res, next) {

    async.waterfall([

      function updateBlock(callback) {

        var type = 'user-blocked';

        // if the user already block this user
        if (req.user.blockUsers.indexOf(req.body.id) >= 0) {
          // unblock him
          req.user.blockUsers.pull(req.body.id);
          type = 'user-unblocked';
        }
        else
          // block him
          req.user.blockUsers.push(req.body.id);

        // update me
        req.user.save(function(err, user) {
          if (err) callback(err);
          else callback(null, type);
        });

      },

      function createActivity(type, callback) {

        Activity.create({
          owner: req.user.id,
          type: type,
          targetId: req.body.id
        }, callback);

      }

    ], function(err, activity) {
      if (err) next(err);
      else res.json({});
    });

  };
};
