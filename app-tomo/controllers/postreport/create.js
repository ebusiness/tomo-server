
module.exports = function(PostReport) {

  return function(req, res, next) {

    PostReport.create({
      reporter: req.user.id,
      post: req.params.post,
      reason: req.body.reason
    }, function(err, report) {
      if (err) next(err);
      else res.json({});
    });

  };
};
