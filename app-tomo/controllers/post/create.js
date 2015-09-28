var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Post, Group, Activity, Notification) {

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

          group: function(callback) {

            if (post.group)
              Group.findByIdAndUpdate(post.group, {
                $addToSet: {posts: post.id}
              }, callback);
            else
              callback(null, null);
          },

          activity: function(callback) {
            Activity.create({
              owner: req.user.id,
              type: 'post-new',
              targetId: post.id
            }, callback);
          },

          notification: function(callback) {
            if (req.user.friends && req.user.friends.length)
              Notification.create({
                from: req.user.id,
                to: req.user.friends,
                type: 'post-new',
                targetId: post.id
              }, callback);
            else
              callback(null);
          }

        }, function(err, results) {
          if (err) callback(err);
          else callback(null, post, results.group, results.notification);
        });
      },

      function sendNotification(post, group, notification, callback) {

        if (notification) {

          var alertMessage = req.user.nickName + '：' + post.content;
          var payload = {
            type: 'post-new',
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo_ref,
              cover:    req.user.cover_ref
            },
            targetId: post._id
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
