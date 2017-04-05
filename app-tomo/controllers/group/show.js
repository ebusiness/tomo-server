module.exports = function(Group) {

  return function(req, res, next) {

    Group.findById(req.params.group, 'owner type name cover introduction coordinate address members companies')
      .populate('owner', 'nickName photo cover')
      .populate('members', 'nickName photo cover')
      .populate('companies.si')
      .populate('companies.end')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
