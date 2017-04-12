var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Project, Activity) {

  return function(req, res, next) {
    // req.body = req.query;
    if ( !req.body.name || !req.body.coordinate || !req.body.endUser){
      res.status(412).end();
      return;
    }

    req.body.creator = req.user.id;

    async.waterfall([
      function createProject(callback) {
        Project.create(req.body, callback);
      },

      function createRelateInfo(project, callback) {
        callback(null, project);

        async.parallel({

          activity: function (callback) {
            Activity.create({
              owner: req.user.id,
              type: 'project-new',
              relateCompany: project._id
            }, callback);
          }

        }, function(err, result) {
          if (err) console.log("" + err);
        });
      }

    ], function(err, result) {
      if (err) next(err);
      else res.json(result);
    });

  };
};
