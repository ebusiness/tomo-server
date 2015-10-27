module.exports = function(Group) {

  return function(req, res, next) {

    var query = Group.find();
    
    // groups name match some string
    if (req.query.name)
      query.where('name').regex('^.*'+req.query.name+'.*$');

    if (req.query.page)
      query.skip(20 * req.query.page);

    query.limit(req.query.size || 20).sort('-members').exec(function(err, groups) {
      if (err) next(err);
      else res.json(groups);
    });
  };
};
