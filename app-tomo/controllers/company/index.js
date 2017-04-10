var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose');

module.exports = function(Company) {

  return function(req, res, next) {

    async.waterfall([

      function findCompanies(callback) {

        // create query
        var query = Company.find()
          .select('-logicDelete');

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
          query.where('name').regex(new RegExp('^.*'+req.query.name+'.*$', "i"));

        if (req.query.hasProjects)
          query.where('projects.0').exists(true);

        if (req.query.hasPosts)
          query.where('posts.0').exists(true);

        query.select()
          .populate('owner', 'nickName photo cover')
          .populate('projects')
          .populate('posts')
          .where('logicDelete').equals(false)
          .skip(20 * req.query.page || 0)
          .limit(req.query.size || 20)
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
