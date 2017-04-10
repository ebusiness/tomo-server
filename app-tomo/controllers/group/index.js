var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose');

module.exports = function(Group) {

  return function(req, res, next) {

    async.waterfall([
      function findGroups(callback) {
        // create query
        var query = Group.find();
        query.where('_id').in(req.user.groups);

        // groups name match some string
        if (req.query.name)
          query.where('name').regex('^.*'+req.query.name+'.*$');

        // groups that has members
        if (req.query.hasMembers)
          query.where('members.0').exists(true);

        query.select('-logicDelete')
          .populate('owner', 'nickName photo cover')
          .populate('members', 'nickName photo cover')
          .skip(20 * req.query.page || 0)
          .limit(req.query.size || 20)
          .where('logicDelete').equals(false)
          // .sort('-createDate')
          .exec(callback);
      }

    ], function(err, groups) {
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
