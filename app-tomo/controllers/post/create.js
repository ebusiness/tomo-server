var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Post, Activity, Notification) {

  return function(req, res, next) {

    async.waterfall([

      function createPost(callback) {
        req.body.owner = req.user.id;
        Post.create(req.body, callback);
      },

      function createRelateInfo(post, callback) {

        async.parallel({

          user: function(callback) {
            req.user.posts.addToSet(post.id);
            req.user.save(callback);
          },

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'post-new',
              targetPost: post.id
            }, callback);
          },

          notification: function(callback) {
            if (req.user.friends && req.user.friends.length)
              Notification.create({
                from: req.user.id,
                to: req.user.friends,
                type: 'post-new',
                targetPost: post.id
              }, callback);
            else
              callback(null);
          }

        }, function(err, results) {
          if (err) callback(err);
          else callback(null, post, results.notification);
        });
      },

      function sendNotification(post, notification, callback) {

        if (notification) {

          var alertMessage = req.user.nickName + '：' + post.content;
          var payload = {
            type: 'post-new',
            id: post.id
          };

          Push(req.user.id, req.user.friends, payload, alertMessage);
        }

        callback(null, post);
      }

    ], function(err, post) {
      if (err) next(err);
      else res.json(post);
    });

  };
};
