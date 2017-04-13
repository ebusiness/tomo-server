var mongoose = require('mongoose');
module.exports = function(Recruit) {

  return function(req, res, next) {
    if (!req.params.recruit || !mongoose.Types.ObjectId.isValid(req.params.recruit)) {
      res.status(412).end();
      return;
    }
    Recruit.findById(req.params.recruit)
      .populate('creator', 'nickName photo cover')
      .populate('endUser')
      .populate('company')
      .populate('candidates', 'nickName photo cover')
      .where('logicDelete').equals(false)
      .exec(function(err, recruit) {
        if (err) next(err);
        res.json(recruit);
      });
  };
};
