module.exports = function(Group) {

  return function(req, res, next) {

    Group.findById(req.params.group, function(err, group) {
      if (err) next(err);
      else res.json(group);
    });

  };
};
