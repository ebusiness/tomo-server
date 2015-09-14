var async = require('async')

module.exports = function(User, Activity) {

  return function(req, res, next) {

    if (!req.body.openid || !req.body.nickname) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
    }

    var userinfo = {
      gender: req.body.sex,
      photo: req.body.headimgurl,
      nickName: req.body.nickname,
      openIdWeChat: req.body.openid,
      type: 'user'
    };

    async.waterfall([

      function(callback) {
        User.create(userinfo, callback)
      },

      function(user, callback) {
        Activity.create({
          owner: user._id,
          type: 'user-activated'
        }, function(err, activity) {
          if (err) callback(err);
          else callback(null, user);
        });
      }

    ], function(err, user) {

      if (err) next(err);
      else {
        // put user's id into session (auto login)
        req.session.userId = user.id;
        res.json(user);
      }
    });

  }
};
