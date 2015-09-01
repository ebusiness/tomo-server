var async = require('async');

module.exports = function(JobComment, Job, User, Notification, Mailer) {

  return function(req, res, next) {

    req.body.owner = req.user.id;
    req.body.target = req.params.id;

    async.waterfall([

      function createComment(callback) {
        JobComment.create(req.body, callback);
      },

      function updateRelavent(comment, callback) {

        async.parallel({

          updateComment: function(callback) {
            if (req.body.replyTo)
              JobComment.findByIdAndUpdate(req.body.replyTo, {
                $addToSet: {
                  replies: comment.id
                }
              }, callback);
            else callback(null);
          },

          updateJob: function(callback) {

            Job.findByIdAndUpdate(req.params.id, {
              $addToSet: {
                comments: comment.id
              }
            }, callback);
          },

          updateUser: function(callback) {

            User.findByIdAndUpdate(req.user.id, {
              $addToSet: {
                jobComments: comment.id
              }
            }, callback);
          }

        }, function(err, result) {
          if (err) callback(err);
          else {
            result.comment = comment;
            callback(null, result);
          }
        });
      },

      function createNotification(relavent, callback) {

        async.parallel({

          notifyJobOwner: function(callback) {

            Notification.create({
              owner: relavent.updateJob.owner,
              from: req.user.id,
              targetComment: relavent.comment.id,
              targetJob: req.params.id
            }, function(err, notification) {

              if (err) callback(err);
              else User.findById(relavent.updateJob.owner, 'email', function(err, user) {

                if (err) callback(err);
                else {
                  Mailer.jobComment({
                    to: user,
                    from: req.user,
                    comment: relavent.comment,
                    job: relavent.updateJob
                  });
                  callback(null);
                }
              });
            });
          },

          notifyCommentOwner: function(callback) {

            if (relavent.updateComment &&
              !relavent.updateComment.owner.equals(req.user.id)) {

              Notification.create({
                owner: relavent.updateComment.owner,
                from: req.user.id,
                targetComment: relavent.comment.id,
                targetJob: req.params.id
              }, function(err, notification) {

                if (err) callback(err);
                else User.findById(relavent.updateComment.owner, 'email', function(err, user) {

                  if (err) callback(err);
                  else {
                    Mailer.jobCommentReply({
                      to: user,
                      from: req.user,
                      comment: relavent.comment,
                      job: relavent.updateJob
                    });
                    callback(null);
                  }
                })
              });

            } else callback(null);

          }

        }, function(err, result) {
          if (err) callback(err);
          else callback(null, relavent.comment);
        });

      }

    ], function(err, comment) {

      if (err) next(err);
      else res.json(comment);
    });

  };

};