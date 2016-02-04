var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Message, Activity, sio) {

  return function(req, res, next) {
    if (!req.body.to) {
      res.status(412).end();
      return;
    }

    async.waterfall([

      function createMessage(callback) {
        req.body.from = req.user.id;
        req.body.opened = [req.user.id];
        Message.create(req.body, callback);
      },

      function sendNotification(message, callback) {

        var room = sio.sockets.adapter.rooms[req.body.to];

        var alertMessage = req.user.nickName ;

        if (message.type == "voice") {
          alertMessage += "给您发送了一段语音";
        } else if(message.type == "photo") {
          alertMessage += "给您发送了一张图片";
        } else if(message.type == "video") {
          alertMessage += "给您发送了一段视频";
        } else { //if(message.type == "text") {
          alertMessage += " : " + message.content;
        }

        var payload = {
          type: 'message-new',
          from: {
            id:       req.user.id,
            nickName: req.user.nickName,
            photo:    req.user.photo_ref,
            cover:    req.user.cover_ref
          },
          messagetype: message.type,
          content: message.content,
          createDate: message.createDate
        }

        if (room) {
          payload.aps = {alert: alertMessage};
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
