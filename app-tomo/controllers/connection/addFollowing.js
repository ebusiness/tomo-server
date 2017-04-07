var async = require('async');

module.exports = function(User) {

  return function(req, res, next) {
    async.waterfall([
        function findUser(callback) {
            User.findById(req.params.user, callback);
        },
        function createRelateInfo(user, callback) {
            async.parallel({

              following: function(callback) {
                if(!user.followers) {
                  user.followers = [];
                }
                user.followers.addToSet(req.user.id);
                user.save(callback);
              },

              follower: function(callback) {

                if(!req.user.following) {
                  req.user.following = [];
                }
                req.user.following.addToSet(user.id);
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
