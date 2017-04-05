module.exports = function(Company) {

  return function(req, res, next) {
    Company.findById(req.params.company)
      .populate('owner', 'nickName photo cover')
      .populate('groups')
      .where('logicDelete').equals(false)
      .exec(function(err, company) {
        if (err) next(err);
        res.json(company);
      });
  };
};
