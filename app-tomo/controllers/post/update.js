var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose');

module.exports = function(Post, Activity, Notification) {

  return function(req, res, next){

    if (!req.params.post || !mongoose.Types.ObjectId.isValid(req.params.post)) {
      var err = new Error('Invalid Parameter');
      err.status = 412;
      next(err);
      return;
    }

    async.waterfall([

      function findPost(callback) {
        Post.findById(req.params.post, callback);
      },

      function createComment(post, callback) {

        var comment = post.comments.create({
              owner: req.user.id,
              content: req.body.content
            });

        post.comments.push(comment);

        post.save(function(err, post) {
          if (err) callback(err);
          else callback(null, post, comment);
        });
      },

      function createRelateInfo(post, comment, callback) {

        async.parallel({

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'post-commented',
              targetPost: post.id,
              targetComment: comment.id
            }, callback);
          },

          notification: function(callback) {

            // if the comment owner is not the post owner
            if (post.owner != req.user.id)
              Notification.create({
                from: req.user.id,
                to: post.owner,
                type: 'post-commented',
                targetId: post.id
              }, callback);
            else
              callback(null);
          }

        }, function(err, results) {
            if (err) callback(err);
            else callback(null, post, comment, results.notification);
        });
      },

      function sendNotification(post, comment, notification, callback) {

        // send message about comment
        if (notification) {

          var alertMessage = req.user.nickName + '评论了您的帖子：' + comment.content;
          var payload = {
            type: 'post-commented',
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo_ref,
              cover:    req.user.cover_ref
            },
            targetId: post._id
          };

          Push(req.user.id, notification.to, payload, alertMessage, function(err, apnNotification){
            console.log("======== apn callback ========");
            console.log(arguments);
            console.log("======== apn callback ========");
            if (err) next(err);
          });
        }

        callback(null, comment);
      }

    ], function(err, comment) {
      if (err) next(err);
      else res.json(comment);
    });

  };
};
