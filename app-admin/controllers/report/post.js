module.exports = function(PostReport) {

  return function(req, res, next) {

    var query = PostReport.find();

    if (req.query.page)
      query.skip(20 * req.query.page);

    query
      .populate('reporter', 'nickName photo cover')
      .populate('post')
      .limit(req.query.size || 20).sort('-createDate').exec(function(err, reports) {
        if (err) next(err);
        else res.json(reports);
      });
  };
};
