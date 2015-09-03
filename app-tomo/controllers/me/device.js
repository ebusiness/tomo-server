
module.exports = function(User) {

  return function(req, res, next) {

    if (!req.body.token) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
      return;
    }

    User.findByIdAndUpdate(req.user.id, {
      device: req.body
    }, function(err, user) {
      if (err) next(err);
      else res.json(user);
    })

  };
};
