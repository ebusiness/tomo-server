module.exports = function(UserReport) {

  return function(req, res, next) {

    var query = UserReport.find();

    if (req.query.page)
      query.skip(20 * req.query.page);

    query
      .populate('reporter', 'nickName photo cover')
      .populate('user', 'nickName photo cover')
      .limit(req.query.size || 20).sort('-createDate').exec(function(err, reports) {
        if (err) next(err);
        else res.json(reports);
      });
  };
};
