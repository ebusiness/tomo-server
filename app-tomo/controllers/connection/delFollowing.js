var async = require('async');

module.exports = function(User) {

  return function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.status(412).end();
      return;
    }
    async.waterfall([
        function findUser(callback) {
            User.findById(req.params.user, callback);
        },
        function createRelateInfo(user, callback) {
            async.parallel({

              following: function(callback) {
                if(user.followers) {
                  user.followers.pull(req.user.id);
                }
                user.save(callback);
              },

              follower: function(callback) {

                if(req.user.following) {
                  req.user.following.pull(req.params.user);
                }
                req.user.save(callback);
              }

            }, callback);
        }
    ], function(err, relateInfo) {
      if (err) next(err);
      else res.json(req.user.following);
    });

  };
};
