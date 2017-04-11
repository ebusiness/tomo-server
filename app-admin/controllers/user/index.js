var async = require('async');

module.exports = function(Group, User) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          group: function(callback) {
            if (req.params.group)
              Group.findById(req.params.group, 'members', callback);
            else
              callback(null, null);
          }

        }, callback);
      },

      function findUsers(relateObj, callback) {

        // create query
        var query = User.find();

        // users of some group
        if (relateObj.group)
          query.where('_id').in(relateObj.group.members);

        var size = (req.query.size || 20) * 1;

        // paging
        if (req.query.page)
          query.skip(size * req.query.page);

        // run query
        query.sort('-createDate').limit(size).exec(callback);
      }

    ], function(err, users) {
      if (err) next(err);
      else if (users.length === 0) {
        var err = new Error('All Users Loaded');
        err.status = 404;
        next(err);
      } else res.json(users);
    });

  };
};
