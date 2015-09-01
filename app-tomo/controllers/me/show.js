// Get single user
// ---------------------------------------------
// Retrun user profile info except password

module.exports = function(User) {

  return function(req, res, next) {

    // check on logic delete flag, return 404 on not found

    User.findById(req.params.id, '-password -logicDelete')
      .exec(function(err, user) {
        if (err) next(err);
        else res.json(user);
      });
  };

};