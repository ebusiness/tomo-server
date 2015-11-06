module.exports = function(User) {

  return function(req, res, next) {

    User.findById(req.params.user, function(err, user) {
      if (err) next(err);
      else res.json(user);
    });
    
  };
};
