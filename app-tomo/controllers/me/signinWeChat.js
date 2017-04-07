var https = require('https'),
    async = require('async');

module.exports = function(User, Invitation, Message, Notification, Activity) {

  return function(req, res, next) {
    req.body = req.query;

    if (!req.body.openid || !req.body.access_token) {
      var err = new Error('Invalid Parameter');
      err.status = 412;
      next(err);
      return;
    }

    var base_url = "https://api.weixin.qq.com/sns/";
    // var url_check = base_url + "auth?openid=" + req.body.openid + "&access_token=" + req.body.access_token;
    var url_userInfo = base_url + "userinfo?openid=" + req.body.openid + "&access_token=" + req.body.access_token;

    httpRequest(url_userInfo, function(data) {

      if (data.errcode) {
        var err = new Error('Invalid Token');
        err.status = 401;
        next(err);
        return;
      }

      async.waterfall([

        function(callback) {
          User.findOne({ openIdWeChat: req.body.openid })
            .select('-password -logicDelete')
            .populate('followers', 'nickName photo')
            .populate('following', 'nickName photo')
            .populate('experience.project')
            // .where('logicDelete').equals(false)
          .exec(callback);
        },

        function(user, callback) {

          if (user == null) {
            signup(data, User, Activity, callback);
          } else if(user.logicDelete) {
            var err = new Error('Access Forbidden');
            err.status = 403;
            next(err);
            return;
          } else {
            callback(null, user);
            // async.parallel({
            //
            //   invitation: function(callback) {
            //     Invitation.find()
            //       .where('to').equals(user.id)
            //       .where('type').equals('friend')
            //       .where('result').equals(null)
            //       .where('logicDelete').equals(false)
            //       .select('from type createDate')
            //       .populate('from', 'nickName photo')
            //       .exec(callback);
            //   },
            //
            //   messages: function(callback) {
            //     var groupIds = [];
            //     if(user.groups && user.groups.length > 0){
            //       user.groups.forEach(function(group){
            //         groupIds.push(group.group._id)
            //       });
            //     }
            //     Message.find()
            //       .select('from group createDate')
            //       .or([
            //         {'group': {$in: groupIds}},
            //         {$and: [
            //           {'to': user.id},
            //           {'from': {$in: user.friends}}
            //         ]}
            //       ])
            //       // .where('to').equals(user.id)
            //       // .where('from').in(user.friends)
            //       .where('opened').ne(user.id)
            //       .where('logicDelete').ne(user.id)
            //       .exec(callback);
            //   },
            //
            //   notifications: function(callback) {
            //     Notification.count()
            //       .where('to').equals(user.id)
            //       .where('confirmed').ne(user.id)
            //       .where('logicDelete').equals(false)
            //       .exec(callback);
            //   }
            //
            // }, function(err, result) {
            //   if (err) callback(err);
            //   else {
            //     user = user.toObject();
            //     user.friendInvitations = result.invitation;
            //     user.newMessages = result.messages;
            //     user.notifications = result.notifications
            //     callback(null, user);
            //   }
            // });
          }
        }

      ], function(err, user) {
        if (err) next(err);
        else {
          // put user's id into session
          req.session.userId = user.id;
          res.json(user);
        }
      });

    });
  };
};

var httpRequest = function(url, callback) {

  https.get(url, function (res) {

    var data = '';

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function () {
      callback(JSON.parse(data));
    });
  });
}

var signup = function(data, User, Activity, callback) {
  var userinfo = {
    gender: data.sex,
    photo: data.headimgurl,
    nickName: data.nickname,
    openIdWeChat: data.openid,
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

  ], callback);
}
