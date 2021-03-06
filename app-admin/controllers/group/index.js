module.exports = function(Group) {

  return function(req, res, next) {

    var query = Group.find();

    // groups name match some string
    if (req.query.name)
      query.where('name').regex('^.*'+req.query.name+'.*$');

    var size = (req.query.size || 20) * 1;
    if (req.query.page)
      query.skip(size * req.query.page);

    query.limit(size).sort('-members').exec(function(err, groups) {
      if (err) next(err);
      else res.json(groups);
    });
  };
};
