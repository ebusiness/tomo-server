var async = require('async');

module.exports = function(User, Job, JobApplication, Notification, Mailer) {

  return function(req, res, next) {

    async.waterfall([

      function updateApplication(callback) {

        JobApplication.findByIdAndUpdate(req.params.id, {
          confirmed: true
        }, callback);
      },

      function updateRelevant(application, callback) {

        async.parallel({

          updateJob: function(callback) {

            Job.findByIdAndUpdate(application.job, {
              $pull: {
                applicants: req.user.id
              },
              $push: {
                crews: req.user.id
              }
            }, callback);
          },

          updateUser: function(callback) {

            User.findByIdAndUpdate(req.user.id, {
              $pull: {
                applications: application.job
              },
              $push: {
                currentJob: application.job
              }
            }, callback);
          }

        }, function(err, result) {
          if (err) callback(err);
          else callback(null, application, result);
        });

      },

      function createNofitication(application, relevants, callback) {

        Notification.create({
          owner: application.jobOwner,
          from: req.user.id,
          type: Notification.TYPE_JOB_EMPLOY_CONFIRM,
          targetJob: application.job
        }, function(err, notification) {

          if (err) callback(err);
          else User.findById(application.jobOwner, 'email', function(err, user) {

            if (err) callback(err);
            else {
              Mailer.jobEmployConfirm({
                to: user,
                from: req.user,
                job: relevants.updateJob
              });
              callback(null, application);
            }
          });
        });

      }

    ], function(err, application) {
      if (err) next(err);
      else res.json(application);
    });

  };
};