module.exports = function(UserReport) {

  return function(req, res, next) {

    var query = UserReport.find();

    var size = (req.query.size || 20) * 1;

    if (req.query.page)
      query.skip(size * req.query.page);

    query
      .populate('reporter', 'nickName photo cover')
      .populate('user', 'nickName photo cover')
      .limit(size).sort('-createDate').exec(function(err, reports) {
        if (err) next(err);
        else res.json(reports);
      });
  };
};
