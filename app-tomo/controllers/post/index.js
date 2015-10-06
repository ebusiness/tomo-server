var async = require('async'),
    moment = require('moment');

module.exports = function(Post, User, Group) {

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

      function findPosts(relateObj, callback) {

        // create query
        var query = Post.find();

        // posts of some one
        if (relateObj.user)
          query.where('_id').in(relateObj.user.posts);

        // posts of some group
        if (relateObj.group)
          query.where('_id').in(relateObj.group.posts);

        // posts of mine
        if (req.query.category == "mine")
          query.where('_id').in(req.user.posts);

        // posts of my bookmark
        if (req.query.category == "bookmark")
          query.where('_id').in(req.user.bookmarks);

        // posts before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        // posts after some time point
        if (req.query.after)
          query.where('createDate').gt(moment.unix(req.query.after).toDate());

        query.select('owner group content images like bookmark comments location coordinate createDate')
          .populate('owner', 'nickName photo cover')
          .populate('group', 'name')
          .populate('comments.owner', 'nickName photo cover')
          .where('logicDelete').equals(false)
          .limit(req.query.size || 10)
          .sort('-createDate')
          .exec(callback);
      }

    ], function(err, posts) {
      if (err) next(err);
      else if (posts.length === 0) {
        var err = new Error('All Post Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(posts);
      }
    });

  };
};
