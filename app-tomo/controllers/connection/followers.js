var async = require('async');

module.exports = function(User) {

  return function(req, res, next) {
    async.waterfall([
        function findRelateObject(callback) {
            if (req.params.user)
              User.findById(req.params.user, 'followers', callback);
            else
              callback(null, null);
        },
        function findFollowers(user, callback) {
            var followers = req.user.followers;
            if(user) {
                followers = user.followers;
            }
            User.find()
              .select('-password -logicDelete -experiences -device')
              .where('_id').in(followers)
              .where('logicDelete').equals(false)
              .skip(20 * req.query.page || 0)
              .limit(req.query.size || 20)
              .sort('-createDate')
              .exec(callback);
        }
    ], function(err, users) {
        if (err) next(err);
        else if (users.length == 0) {
          var error = new Error('Not Found')
          error.status = 404;
          next(error);
        } else res.json(users);
    });

  };
};