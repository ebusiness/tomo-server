var mongoose = require('mongoose');

module.exports = function(Group) {

  return function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.group)) {
      res.status(412).end();
      return;
    }

    Group.findById(req.params.group, '-logicDelete')
      .populate('owner', 'nickName photo cover')
      .populate('members', 'nickName photo cover')
      .where('logicDelete').equals(false)
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
	    });
  };
};
