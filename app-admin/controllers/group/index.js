module.exports = function(Group) {

  return function(req, res, next) {

    Group.find().sort('-members').limit(20).exec(function(err, groups) {
      if (err) next(err);
      else res.json(groups);
    });
  };
};
