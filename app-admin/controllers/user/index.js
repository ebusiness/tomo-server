module.exports = function(User) {

  return function(req, res, next) {

    User.find().sort('-createDate').limit(20).exec(function(err, user) {
      if (err) next(err);
      else res.json(user);
    });
  };
};
