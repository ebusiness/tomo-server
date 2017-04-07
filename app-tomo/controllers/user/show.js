module.exports = function(User) {

  return function(req, res, next) {
    User.findById(req.params.user)
      .select('-password -logicDelete -experiences -device')
      .populate('experiences.project')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
