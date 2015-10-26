module.exports = function(Post) {

  return function(req, res, next) {

    Post.find().populate('owner', 'nickName photo cover').sort('-createDate').limit(20).exec(function(err, posts) {
      if (err) next(err);
      else res.json(posts);
    });
  };
};
