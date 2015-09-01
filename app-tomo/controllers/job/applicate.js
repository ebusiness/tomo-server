var async = require('async');

module.exports = function(Job, User, JobApplication, Notification, Mailer) {

  return function(req, res, next) {

    async.waterfall([

      function updateRelavent(callback) {

        async.parallel({

          updateJob: function(callback) {

            Job.findByIdAndUpdate(req.params.id, {
              $addToSet: {
                applicants: req.user.id
              }
            }, callback);
          },

          updateUser: function(callback) {

            User.findByIdAndUpdate(req.user.id, {
              $addToSet: {
                applications: req.params.id
              }
            }, callback);
          }

        }, callback);

      },

      function createApplication(relavent, callback) {

        JobApplication.create({
          user: req.user.id,
          job: req.params.id,
          jobOwner: relavent.updateJob.owner,
          company: relavent.updateJob.company
        }, function(err, application) {
          if (err) callback(err);
          else callback(null, relavent);
        });
      },

      function createNotification(relavent, callback) {

        Notification.create({
          owner: relavent.updateJob.owner,
          from: req.user.id,
          type: Notification.TYPE_JOB_APPLICATION,
          targetJob: req.params.id
        }, function(err, notification) {

          if (err) callback(err);
          else User.findById(relavent.updateJob.owner, 'email', function(err, user) {

            if (err) callback(err);
            else {
              Mailer.jobApplicate({
                to: user,
                from: req.user,
                job: relavent.updateJob
              });
              callback(null);
            }
          });
        });

      }

    ], function(err, result) {

      if (err) next(err);
      else res.json(result);

    });

  };

};
