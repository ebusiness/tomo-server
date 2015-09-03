var https = require('https'),
    async = require('async');

module.exports = function(User, Invitation, Message) {

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
          User.findOne({
            openIdWeChat: req.body.openid
          }, 'firstName lastName nickName photo cover birthDay gender telNo address bio friends invitations', callback);
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
                  .select('_from createDate')
                  .where('_recipient').equals(user.id)
                  .where('opened').ne(user.id)
                  .where('logicDelete').ne(user.id)
                  .exec(callback);
              }

            }, function(err, result) {
              if (err) callback(err);
              else {
                user = user.toObject();
                user.friendInvitations = result.invitation;
                user.newMessages = result.messages;
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