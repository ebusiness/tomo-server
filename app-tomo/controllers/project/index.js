var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

module.exports = function(Project) {

  return function(req, res, next) {

    async.waterfall([

      function findProjects(callback) {

        // create query
        var query = Project.find()
          .select('-logicDelete');

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

        if (req.query.hasMembers)
          query.where('members.0').exists(true);

        if (req.query.hasPosts)
          query.where('posts.0').exists(true);

        if (req.query.page)
          query.skip(20 * req.query.page)
            .limit(req.query.size || 20);

        query.select()
          .populate('creator', 'nickName photo cover')
          .populate('endUser')
          .populate('relCompanies')
          .populate('members')
          .populate('posts')
          .where('logicDelete').equals(false)
          // .sort('-createDate')
          .exec(callback);
      }

    ], function(err, groups) {
      if (err) next(err);
      else if (groups.length === 0) {
        var err = new Error('All Projects Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(groups);
      }
    });

  };
};
