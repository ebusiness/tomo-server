module.exports = function(User) {

  return function(req, res, next) {

    // if (req.session.userId) {
    //   // find user by his id
    //   User.findById(req.session.userId, '-password -logicDelete')
    //     .exec(function(err, user) {
    //       if (err) next(err);
    //       else if (!user) res.status(401).end();
    //       else res.json(user);
    //     });
    // } else res.status(401).end();

    res.json(req.user);
  };

};
