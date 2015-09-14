var async = require('async'),
    moment = require('moment');

module.exports = function(Post, User) {

  return function(req, res, next) {

    async.waterfall([

      function findUser(callback) {

        if (req.params.user)
          User.findById(req.params.user, 'posts', callback);
        else
          callback(null, null);
      },

      function findPosts(user, callback) {

        // create query
        var query = Post.find();

        // post of some one
        if (user)
          query.where('_id').in(user.posts);

        // post of mine
        if (req.query.category == "mine")
          query.where('_id').in(req.user.posts);

        // post of my bookmark
        if (req.query.category == "bookmark")
          query.where('_id').in(req.user.bookmarks);

        // post can be displayed on map
        if (req.query.category == "mapnews")
          query.where('coordinate').exists(true);

        // post of some day
        if (req.query.day) {
          query.where('createDate').gte(moment.unix(req.query.day));
          query.where('createDate').lte(moment.unix(req.query.day).add(1, 'days'));
        }

        // post before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        // post after some time point
        if (req.query.after)
          query.where('createDate').gt(moment.unix(req.query.after).toDate());

        query.select('owner content images like bookmark comments coordinate createDate')
          .populate('owner', 'nickName photo cover')
          .populate('comments.owner', 'nickName photo cover')
          .where('logicDelete').equals(false)
          .limit(req.query.size || 20)
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
