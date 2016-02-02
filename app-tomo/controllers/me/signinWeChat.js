var https = require('https'),
    async = require('async');

module.exports = function(User, Invitation, Message, Notification) {

  return function(req, res, next) {

    if (!req.body.openid || !req.body.access_token) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
      return;
    }

    var url_check = "https://api.weixin.qq.com/sns/auth?openid=" + req.body.openid + "&access_token=" + req.body.access_token;

    httpRequest(url_check, function(data) {

      if (data.errcode) {
        var err = new Error('Invalid Token');
        err.status = 401;
        next(err);
        return;
      }

      async.waterfall([

        function(callback) {
          User.findOne({ openIdWeChat: req.body.openid })
          .select('firstName lastName nickName photo cover birthDay gender telNo address bio friends invitations groups blockUsers primaryStation pushSetting')
          .populate('primaryStation', 'name coordinate introduction cover')
          .exec(callback);
        },

        function(user, callback) {

          if (user == null) {
            var err = new Error('User Not Found');
            err.status = 404;
            callback(err);
          } else {

            // put user's id into session
            req.session.userId = user.id;

            async.parallel({

              invitation: function(callback) {
                Invitation.find()
                  .where('to').equals(user.id)
                  .where('type').equals('friend')
                  .where('result').equals(null)
                  .where('logicDelete').equals(false)
                  .select('from type createDate')
                  .populate('from', 'nickName photo')
                  .exec(callback);
              },

              messages: function(callback) {
                Message.find()
                  .select('from group createDate')
                  .or([
                    {'group': {$in: user.groups}},
                    {$and: [
                      {'to': user.id},
                      {'from': {$in: user.friends}}
                    ]}
                  ])
                  // .where('to').equals(user.id)
                  // .where('from').in(user.friends)
                  .where('opened').ne(user.id)
                  .where('logicDelete').ne(user.id)
                  .exec(callback);
              },

              notifications: function(callback) {
                Notification.count()
                  .where('to').equals(user.id)
                  .where('confirmed').ne(user.id)
                  .where('logicDelete').equals(false)
                  .exec(callback);
              }

            }, function(err, result) {
              if (err) callback(err);
              else {
                user = user.toObject();
                user.friendInvitations = result.invitation;
                user.newMessages = result.messages;
                user.notifications = result.notifications
                callback(null, user);
              }
            });
          }
        }

      ], function(err, user) {
        if (err) next(err);
        else res.json(user);
      });

    });
  };
};

var httpRequest = function(url,callback) {

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
