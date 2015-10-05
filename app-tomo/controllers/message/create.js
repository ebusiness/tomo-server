var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Message, Activity, sio) {

  return function(req, res, next) {

    async.waterfall([

      function createMessage(callback) {
        req.body.from = req.user.id;
        Message.create(req.body, callback)
      },

      function sendNotification(message, callback) {

        var room = sio.sockets.adapter.rooms[req.body.to];

        var alertMessage = req.user.nickName + " : " + message.content ;

        var reg_content = /^(\[(voice|photo|video)\]).*$/i;
        if (reg_content.test(message.content)){
            var msgtype = message.content.replace(reg_content,"$1");
            if (msgtype == "[voice]") {
              alertMessage = req.user.nickName + "发给您一段语音";
            } else if(msgtype == "[photo]") {
              alertMessage = req.user.nickName + "发给您一张图片";
            } else if(msgtype == "[video]") {
              alertMessage = req.user.nickName + "发给您一段视频";
            }
        }

        var payload = {
          type: 'message-new',
          from: {
            id:       req.user.id,
            nickName: req.user.nickName,
            photo:    req.user.photo_ref,
            cover:    req.user.cover_ref
          },
          createDate: message.createDate
        }

        if (room) {
          payload.aps = {alert: message.content};
          sio.to(req.body.to).emit(payload.type, payload);
        } else {
          Push(req.user.id, req.body.to, payload, alertMessage, function(err, apnNotification){
            console.log("======== apn callback ========");
            console.log(arguments);
            console.log("======== apn callback ========");
            if (err) next(err);
          });
        }

        callback(null, message);
      }

    ], function(err, message) {
      if (err) next(err);
      else res.json(message);
    });

  };
};
