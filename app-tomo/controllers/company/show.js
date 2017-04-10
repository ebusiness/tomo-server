var mongoose = require('mongoose');
module.exports = function(Company) {

  return function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.company)) {
      res.status(412).end();
      return;
    }
    Company.findById(req.params.company)
      .populate('owner', 'nickName photo cover')
      .populate('projects')
      .populate('posts')
      .where('logicDelete').equals(false)
      .exec(function(err, company) {
        if (err){
          next(err);
        } else if (company == null) {
          res.status(404).end();
        } else {
          res.json(company);
        }
      });
  };
};
