module.exports = function(User) {

  return function(req, res, next) {
    User.findById(req.params.user, 'nickName firstName lastName photo cover birthDay gender telNo address bio groups')
			.populate('groups.group')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
