module.exports = function(Company) {

  return function(req, res, next) {
    Company.findById(req.params.company)
      .populate('owner', 'nickName photo cover')
      .populate('projects')
      .populate('posts')
      .where('logicDelete').equals(false)
      .exec(function(err, company) {
        if (err) next(err);
        res.json(company);
      });
  };
};
