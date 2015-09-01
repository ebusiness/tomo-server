module.exports = function(Job) {

  return function(req, res, next) {

    Job.find({
        logicDelete: false
      })
      .populate('owner')
      .populate('company')
      .sort('-createDate')
      .exec(function(err, jobs) {
        if (err) next(err);
        else res.json(jobs);
      });

  };

};