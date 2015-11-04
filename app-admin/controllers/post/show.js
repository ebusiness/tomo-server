module.exports = function(Post) {

  return function(req, res, next) {

    Post.findById(req.params.post)
      .populate('owner', 'nickName photo cover firstName lastName')
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
