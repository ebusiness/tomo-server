module.exports = function(Job) {

  return function(req, res, next) {

    Job.findById(req.params.id)
      .populate('owner')
      .populate('company')
      .exec(function(err, job) {
        if (err) next(err);
        else res.json(job);
      });

  };

};