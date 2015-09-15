var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Post, Activity, Notification) {

  return function(req, res, next) {

    async.waterfall([

      function findPost(callback) {
        Post.findById(req.params.post, callback);
      },

      function updateRelateInfo(post, callback) {

        async.parallel({

          user: function(callback) {

            if (req.user.bookmarks.indexOf(post.id) >= 0)
              User.findByIdAndUpdate(req.user.id, {$pull: {bookmarks: post.id}}, callback);
            else
              User.findByIdAndUpdate(req.user.id, {$push: {bookmarks: post.id}}, callback);
          },

          post: function(callback) {

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

          }

        }, function(err, result) {
          if (err) callback(err);
          else callback(null, result.post[0], result.post[1], result.post[2]);
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
                targetId: post.id
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
                targetId: post.id
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
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo,
              cover:    req.user.cover
            },
            targetId: post._id
          };

          Push(req.user.id, post.owner, payload, alertMessage, function(err, apnNotification){
            console.log("======== apn callback ========");
            console.log(arguments);
            console.log("======== apn callback ========");
            if (err) next(err);
          });
        }

        callback(null, post);
      }

    ], function(err, post) {
      if (err) next(err);
      else res.json(post);
    });

  };
};
