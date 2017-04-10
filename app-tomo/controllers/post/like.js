var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose');

module.exports = function(Post, Activity, Notification) {

  return function(req, res, next) {

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

      function updateLike(post, callback) {

        // wether this is the first time this user like this post
        var isFirstTime = true,
            type = 'post-liked';

        // if the user exists in the "liked" field
        if (post.liked.indexOf(req.user.id) >= 0)
          // it's not the first time he/she like it
          isFirstTime = false;
        else
          // it is the first time, save the user's id in "liked" field
          post.liked.push(req.user.id);

        // if the user already liked this post
        if (post.like.indexOf(req.user.id) >= 0) {
          // unlike it
          post.like.pull(req.user.id);
          type = 'post-unliked';
        }
        else
          // like it
          post.like.push(req.user.id);

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
                targetId: post.id
              }, callback);
            else
              callback(null);
          },

          notification: function(callback) {

            // only in the firstTime other people like this post
            if (type === 'post-liked' && isFirstTime && post.owner != req.user.id)
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

          var alertMessage = req.user.nickName + '赞了您的帖子.';
          var payload = {
            type: 'post-liked',
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo_ref,
              cover:    req.user.cover_ref
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

        // the last result is the updated post
        callback(null, post);
      }

    ], function(err, post) {
      if (err) next(err);
      else res.json(post);
    });

  };
};
