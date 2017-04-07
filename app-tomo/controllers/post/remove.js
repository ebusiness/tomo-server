var async = require('async');

module.exports = function(Post) {

  return function(req, res, next) {

    // TODO: if this post was removed, what to do with the activites
    // and notifications relate on it? and comments, bookmarks?
    if (req.user.posts.indexOf(req.params.post) == -1) {
      res.status(403).end();
      return;
    }

    async.waterfall([
      function deletePost(callback) {
        Post.findByIdAndUpdate(req.params.post, {logicDelete: true}, callback);
      },

      function updateUser(post, callback) {
        req.user.posts.pull(post.id);
        req.user.save(callback);
      }

    ], function(err, user) {
      if (err) next(err);
      else res.json(user);
    });

  };
};
