module.exports = function(Group) {

  return function(req, res, next) {

    Group.findById(req.params.group, 'owner type name cover introduction coordinate address members station')
      .populate('members', 'nickName photo cover')
      .populate('station', 'name line coordinate')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
