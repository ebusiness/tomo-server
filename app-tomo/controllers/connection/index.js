var async = require('async'),
    moment = require('moment');

module.exports = function(User, Project, Company) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          project: function(callback) {
            if (req.params.project) {
                if (!mongoose.Types.ObjectId.isValid(req.params.project)) {
                  var err = new Error('Invalid Parameter');
                  err.status = 412;
                  callback(err, null);
                  return;
                }
                Project.findById(req.params.project, 'members', callback);
            } else {
                callback(null, null);
            }
          },

          company: function(callback) {
            if (req.params.company) {
                if (!mongoose.Types.ObjectId.isValid(req.params.company)) {
                  var err = new Error('Invalid Parameter');
                  err.status = 412;
                  callback(err, null);
                  return;
                }
                Company.findById(req.params.company, 'employees', callback);
            } else {
                callback(null, null);
            }
          },

        }, callback);
      },

      function findUsers(relateObj, callback) {
        // create query
        var query = User.find();

        // users of some project
        if (relateObj.project)
          query.where('_id').in(relateObj.project.members);

        // users of some company
        if (relateObj.company)
          query.where('_id').in(relateObj.company.employees);

        query
          .select('-password -logicDelete -experiences -device')
          .where('logicDelete').equals(false)
          .skip(20 * req.query.page || 0)
          .limit(req.query.size || 20)
          .exec(callback);
      }

    ], function(err, users) {
      if (err) next(err);
      else if (users.length === 0) {
        var err = new Error('All Users Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(users);
      }
    });

  };
};
