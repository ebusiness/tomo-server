var async = require('async'),
    moment = require('moment');

module.exports = function(User, Project) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          project: function(callback) {
            if (req.params.project)
              Project.findById(req.params.project, 'members', callback);
            else
              callback(null, null);
          },

        }, callback);
      },

      function findUsers(relateObj, callback) {
        // create query
        var query = User.find();

        // users of some project
        if (relateObj.project)
          query.where('_id').in(relateObj.project.members);

        query
          .select('-password -logicDelete -experiences -device')
          .where('logicDelete').equals(false)
          .skip(20 * req.query.page || 0)
          .limit(req.query.size || 20)
          .exec(callback);
      }

    ], function(err, users) {
      if (err) next(err);
      else if (users.length === 0) {
        var err = new Error('All Users Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(users);
      }
    });

  };
};
