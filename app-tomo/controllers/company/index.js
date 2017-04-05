var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

module.exports = function(Company, Group) {

  return function(req, res, next) {

    async.waterfall([

      function findCompanies(callback) {

        // create query
        var query = Company.find();

        // Companies of some type
        if (req.query.type)
          query.where('type').equals(req.query.type);

        // Companies near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate
          });

        // Companies in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

        // Companies name match some string
        if (req.query.name)
          query.where('name').regex('^.*'+req.query.name+'.*$');

        if (req.query.hasGroups)
          query.where('groups.0').exists(true);

        // Companies that has members
        // if (req.query.hasMembers)
        //   query.where('members.0').exists(true);

        if (req.query.page)
          query.skip(20 * req.query.page)
            .limit(req.query.size || 20);

        query.select()
          .populate('owner', 'nickName photo cover')
          .populate('groups')
          .where('logicDelete').equals(false)
          // .sort('-createDate')
          .exec(callback);
      }

    ], function(err, groups) {
      if (err) next(err);
      else if (groups.length === 0) {
        var err = new Error('All Company Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(groups);
      }
    });

  };
};
