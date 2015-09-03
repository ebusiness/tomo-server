module.exports = function(Post) {

  return function(req, res, next) {

    Post.findById(req.params.post)
      .where('logicDelete').equals(false)
      .populate('owner', 'nickName photo cover')
      .populate('comments.owner', 'nickName photo cover')
      .exec(function(err, post) {
        if (err) next(err);
        else res.json(post);
      });
  };
};