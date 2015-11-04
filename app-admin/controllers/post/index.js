module.exports = function(Post) {

  return function(req, res, next) {

    var query = Post.find();

    if (req.query.page)
      query.skip(20 * req.query.page);

    query.populate('owner', 'nickName photo cover').sort('-createDate').limit(20).exec(function(err, posts) {
      if (err) next(err);
      else res.json(posts);
    });
  };
};
