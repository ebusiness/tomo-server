module.exports = function(User) {

  return function(req, res, next) {

    if (req.user && req.user.device) {
      User.findByIdAndUpdate(req.user.id, {
        device: {}
      }, function(err, user) {
        if (err) next(err);
      });
    }

    req.session.destroy();
    res.json({});

  };
};
