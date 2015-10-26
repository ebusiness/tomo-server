module.exports = function(Group) {

  return function(req, res, next) {

    Group.findById(req.params.group, 'owner type name cover introduction coordinate address members posts')
      .populate('members', 'nickName photo cover firstName lastName')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
