// Edit Profile

module.exports = function(User) {

  return function(req, res, next) {

    delete req.body._id;

    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
      if (err) next(err);
      else res.json(user);
    });

  };

};