module.exports = function(Project) {

  return function(req, res, next) {
    Project.findById(req.params.project)
      .populate('creator', 'nickName photo cover')
      .populate('endUser')
      .populate('members')
      .populate('posts')
      .where('logicDelete').equals(false)
      .exec(function(err, company) {
        if (err) next(err);
        res.json(company);
      });
  };
};
