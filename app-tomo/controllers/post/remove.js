var async = require('async');

module.exports = function(Post) {

  return function(req, res, next) {

    // TODO: check post's ownership
    // TODO: if this post was removed, what to do with the activites
    // and notifications relate on it? and comments, bookmarks?

    async.waterfall([

      function deletePost(callback) {
        Post.findByIdAndUpdate(req.params.post, {logicDelete: true}, callback);
      },

      function updateUser(post, result, callback) {
        req.user.posts.pull(post.id);
        req.user.save(callback);
      }

    ], function(err, user) {
      if (err) next(err);
      else res.json(user);
    });

  };
};
