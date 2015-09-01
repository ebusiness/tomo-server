module.exports = function(JobApplication) {

  return function(req, res, next) {

    JobApplication.find()
      .where('user').equals(req.user.id)
      .where('employ').equals(true)
      .where('logicDelete').equals(false)
      .where('confirmed').equals(false)
      .populate('job')
      .populate('jobOwner').select('-password')
      .populate('company')
      .exec(function(err, applications) {
        if (err) next(err);
        else res.json(applications);
      });

  };

};
