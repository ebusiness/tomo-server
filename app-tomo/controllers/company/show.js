module.exports = function(Company) {

  return function(req, res, next) {

    Company.findById(req.params.id)
      .populate('owner', '-password')
      .exec(function(err, company) {
        if (err) next(err);
        else res.json(company);
      });
  };

};