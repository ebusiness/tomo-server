var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

module.exports = function(Group) {

  return function(req, res, next) {

    // create query
    var query = Group.find();

    // discover groups
    if (req.query.category == "discover")
      query.where('_id').nin(req.user.groups);

    // groups of mine
    if (req.query.category == "mine")
      query.where('_id').in(req.user.groups);

    // groups of some type
    if (req.query.type)
      query.where('type').equals(req.query.type);

    // groups near some coordinate
    if (req.query.coordinate)
      query.where('coordinate').near({
        center: req.query.coordinate
      });

    // groups in a box
    if (req.query.box)
      query.where('coordinate').within({
        box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
      });

    // groups name match some string
    if (req.query.name)
      query.where('name').regex('^.*'+req.query.name+'.*$');

    // groups that has posts
    if (req.query.hasPosts)
      query.where('posts.0').exists(true);

    // groups that has members
    if (req.query.hasMembers)
      query.where('members.0').exists(true);

    if (req.query.page)
      query.skip(20 * req.query.page)
        .limit(req.query.size || 20);

    query.select('owner type name cover introduction coordinate pref address members posts')
      .populate('owner', 'nickName photo')
      .where('logicDelete').equals(false)
      .exec(function(err, groups) {
        if (err) next(err);
        else if (groups.length === 0) {
          var err = new Error('All Group Loaded');
          err.status = 404;
          next(err);
        } else {
          res.json(groups);
        }
      });

  };
};
