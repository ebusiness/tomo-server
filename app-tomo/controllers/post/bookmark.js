var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(Post, Activity, Notification) {

  return function(req, res, next) {

    async.waterfall([

      function findPost(callback) {
        Post.findById(req.params.post, callback);
      },

      function updateBookmark(post, callback) {

        // wether this is the first time this user bookmark this post
        var isFirstTime = true,
            type = 'post-bookmarked';

        // if the user exists in the "bookmarked" field
        if (post.bookmarked.indexOf(req.user.id) >= 0)
          // it's not the first time he/she bookmark it
          isFirstTime = false;
        else
          // it is the first time, save the user's id in "bookmarked" field
          post.bookmarked.push(req.user.id);

        // if the user already bookmarked this post
        if (post.bookmark.indexOf(req.user.id) >= 0) {
          // unbookmark it
          post.bookmark.pull(req.user.id);
          type = 'post-unbookmarked';
        }
        else
          // bookmark it
          post.bookmark.push(req.user.id);

        // update the post
        post.save(function(err, post) {
          if (err) callback(err);
          else callback(null, post, type, isFirstTime);
        });
      },

      function createRelateInfo(post, type, isFirstTime, callback) {

        async.parallel({

          activity: function(callback) {

            // only for the people other than post owner
            if (post.owner != req.user.id)
              Activity.create({
                owner: req.user.id,
                type: type,
                targetPost: post.id
              }, callback);
            else
              callback(null);
          },

          notification: function(callback) {

            // only in the firstTime other people bookmark this post
            if (type === 'post-bookmarked' && isFirstTime && post.owner != req.user.id)
              Notification.create({
                from: req.user.id,
                to: post.owner,
                type: type,
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

          var alertMessage = req.user.nickName + '收藏了您的帖子.';
          var payload = {
            type: 'post-bookmarked',
            id: post.id
          };

          Push(req.user.id, post.owner._id, alertMessage);
        }

        callback(null, post);
      }

    ], function(err, post) {
      if (err) next(err);
      else res.json(post);
    });

  };
};
