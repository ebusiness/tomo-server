var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose');

module.exports = function(Recruit, Company, User) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          // user: function(callback) {
          //   if (req.params.user) {
          //       if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
          //         res.status(412).end();
          //         return;
          //       }
          //       User.findById(req.params.user, 'experiences.project', callback);
          //   } else {
          //       callback(null, null);
          //   }
          // },

          company: function(callback) {
            if (req.params.company) {
                if (!mongoose.Types.ObjectId.isValid(req.params.company)) {
                  res.status(412).end();
                  return;
                }
                Company.findById(req.params.company, 'recruits', callback);
            } else {
                callback(null, null);
            }
          }

        }, callback);
      },

      function findProjects(relateObj, callback) {

        // create query
        var query = Recruit.find()
          .select('-logicDelete');

        // Recruits of some company
        if (relateObj.company)
          query.where('_id').in(relateObj.company.recruits);

        // Recruits near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate
          });

        // Recruits in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

        // Recruits name match some string
        if (req.query.name)
          query.where('name').regex(new RegExp('^.*'+req.query.name+'.*$', "i"));

        if (req.query.hasMembers)
          query.where('candidates.0').exists(true);

        var size = (req.query.size || 20) * 1;
        query.select()
          .populate('creator', 'nickName photo cover')
          .populate('endUser')
          .populate('company')
          .populate('candidates', 'nickName photo cover')
          .where('logicDelete').equals(false)
          .skip(size * (req.query.page || 0))
          .limit(size)
          // .sort('-createDate')
          .exec(callback);
      }

    ], function(err, groups) {
      if (err) next(err);
      else if (groups.length === 0) {
        var err = new Error('All Recruits Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(groups);
      }
    });

  };
};
