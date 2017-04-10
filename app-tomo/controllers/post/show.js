module.exports = function(Post) {

  return function(req, res, next) {

    if (!req.params.post || !mongoose.Types.ObjectId.isValid(req.params.post)) {
      var err = new Error('Invalid Parameter');
      err.status = 412;
      next(err);
      return;
    }

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
