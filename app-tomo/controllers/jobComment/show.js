module.exports = function(JobComment) {

  return function(req, res, next) {

    JobComment.find({
        target: req.params.id
      })
      .populate('owner')
      .populate('company')
      .exec(function(err, comments) {
        if (err) next(err);
        else res.json(comments);
      });
  };
};