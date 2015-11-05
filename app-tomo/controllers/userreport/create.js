
module.exports = function(UserReport) {

  return function(req, res, next) {

    UserReport.create({
      reporter: req.user.id,
      user: req.params.user,
      reason: req.body.reason
    }, function(err, report) {
      if (err) next(err);
      else res.json({});
    });

  };
};
