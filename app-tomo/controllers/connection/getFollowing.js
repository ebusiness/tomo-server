var async = require('async'),
    mongoose = require('mongoose');

module.exports = function(User) {

  return function(req, res, next) {
    async.waterfall([
        function findRelateObject(callback) {
            if (req.params.user) {
                if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
                  var err = new Error('Invalid Parameter');
                  err.status = 412;
                  callback(err, null);
                  return;
                }
                User.findById(req.params.user, 'following', callback);
            } else {
                callback(null, null);
            }
        },
        function findFollowers(user, callback) {
            var following = req.user.following;
            if(user) {
                following = user.following;
            }
            var size = (req.query.size || 20) * 1;

            User.find()
              .select('-password -logicDelete -experiences -device')
              .where('_id').in(following)
              .where('logicDelete').equals(false)
              .skip(size * (req.query.page || 0))
              .limit(size)
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
