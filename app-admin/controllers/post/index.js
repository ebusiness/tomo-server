var async = require('async');

module.exports = function(User, Group, Post) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          user: function(callback) {
            if (req.params.user)
              User.findById(req.params.user, 'posts', callback);
            else
              callback(null, null);
          },

          group: function(callback) {
            if (req.params.group)
              Group.findById(req.params.group, 'posts', callback);
            else
              callback(null, null);
          }

        }, callback);
      },

      function findPost(relateObj, callback) {

        // create query
        var query = Post.find();

        // posts of some user
        if (relateObj.user)
          query.where('_id').in(relateObj.user.posts);

        // posts of some group
        if (relateObj.group)
          query.where('_id').in(relateObj.group.posts);

        var size = (req.query.size || 20) * 1;
        // paging
        if (req.query.page)
          query.skip(size * req.query.page);

        // run query
        query.populate('owner', 'nickName photo cover')
          .sort('-createDate').limit(size)
          .exec(callback);
      }

    ], function(err, posts){
      if (err) next(err);
      else if (posts.length === 0) {
        var err = new Error('All Posts Loaded');
        err.status = 404;
        next(err);
      } else res.json(posts);
    });

  };
};
