module.exports = function(Post) {

  return function(req, res, next) {

    Post.findById(req.params.post)
      .where('logicDelete').equals(false)
      .populate('owner', 'nickName photo cover')
      .populate('like', 'nickName photo')
      .populate('project')
      .populate('company')
      .populate('comments.owner', 'nickName photo')
      .exec(function(err, post) {
        if (err) next(err);
        else if (!post) {
          var err = new Error('Not Found');
          err.status = 404;
          next(err);
        } else {
          res.json(post);
        }
      });
  };
};
