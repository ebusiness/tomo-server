var mongoose = require('mongoose');
module.exports = function(Project) {

  return function(req, res, next) {
    if (!req.params.project || !mongoose.Types.ObjectId.isValid(req.params.project)) {
      res.status(412).end();
      return;
    }
    Project.findById(req.params.project)
      .populate('creator', 'nickName photo cover')
      .populate('endUser')
      .populate('relCompanies')
      .populate('members', 'nickName photo cover')
      // .populate('posts')
      .where('logicDelete').equals(false)
      .exec(function(err, company) {
        if (err) next(err);
        res.json(company);
      });
  };
};
