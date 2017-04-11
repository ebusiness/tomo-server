var _ = require('lodash'),
    async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose');

module.exports = function(Project, Company, User) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          user: function(callback) {
            if (req.params.user) {
                if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
                  res.status(412).end();
                  return;
                }
                User.findById(req.params.user, 'experiences.project', callback);
            } else {
                callback(null, null);
            }
          },

          company: function(callback) {
            if (req.params.company) {
                if (!mongoose.Types.ObjectId.isValid(req.params.company)) {
                  res.status(412).end();
                  return;
                }
                Company.findById(req.params.company, 'projects', callback);
            } else {
                callback(null, null);
            }
          }

        }, callback);
      },

      function findProjects(relateObj, callback) {

        // create query
        var query = Project.find()
          .select('-logicDelete');

        // projects of some company
        if (relateObj.user) {
          var projects = [];
          if (relateObj.user.experiences) {
              relateObj.user.experiences.forEach(function(experience) {
                  projects.push(experience.project);
              });
          }
          query.where('_id').in(projects);
        }

        // projects of some company
        if (relateObj.company)
          query.where('_id').in(relateObj.company.projects);

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

        if (req.query.hasMembers)
          query.where('members.0').exists(true);

        if (req.query.hasPosts)
          query.where('posts.0').exists(true);

        var size = (req.query.size || 20) * 1;
        query.select()
          .populate('creator', 'nickName photo cover')
          .populate('endUser')
          .populate('relCompanies')
          .populate('members', 'nickName photo cover')
          .populate('posts')
          .where('logicDelete').equals(false)
          .skip(size * req.query.page || 0)
          .limit(size || 20)
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
