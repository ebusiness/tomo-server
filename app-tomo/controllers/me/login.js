module.exports = function(User) {

  return function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password)
      res.status(400).end();
    else
    // look up user info
      User.findOne(req.body, '-password -logicDelete')
      .where('type').equals('user')
      .exec(function(err, user) {

        // pass if error happend
        if (err) next(err);

        // if the account not found, return the fail status
        else if (!user) res.status(401).end();
        // if account could be found
        else {
          // put user's id into session
          req.session.userId = user.id;
          // send user info back
          res.json(user);
        }
      });
  };

};
