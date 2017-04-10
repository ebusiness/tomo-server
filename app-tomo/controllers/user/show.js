var mongoose = require('mongoose');
module.exports = function(User) {

  return function(req, res, next) {
    if (!req.params.user || !mongoose.Types.ObjectId.isValid(req.params.user)) {
      res.status(412).end();
      return;
    }
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
