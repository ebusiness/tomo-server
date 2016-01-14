var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, GroupMessage, Activity, sio) {

  return function(req, res, next) {

    var groups = req.user.groups.toObject()
    if ( !groups.indexOf(req.params.group) ){
      res.status(403).end();
      return;
    }

    async.waterfall([

      function createMessage(callback) {
        req.body.from = req.user.id;
        req.body.group = req.params.group;
        req.body.opened = [req.user.id];
        GroupMessage.create(req.body, callback)
      },

      function sendNotification(message, callback) {

        var pushMembers = [];
        Group.findById(req.params.group, function(err, group) {

          var alertMessage = req.user.nickName ;

          if (message.type == "voice") {
            alertMessage += "发到群组[" + group.name + "]里一段语音";
          } else if(message.type == "photo") {
            alertMessage += "发到群组[" + group.name + "]里一张图片";
          } else if(message.type == "video") {
            alertMessage += "发到群组[" + group.name + "]里一段视频";
          } else { //if(message.type == "text") {
            alertMessage += " : " + message.content;
          }

          var payload = {
            type: 'message-group',
            from: {
              id:       req.user.id,
              nickName: req.user.nickName,
              photo:    req.user.photo_ref,
              cover:    req.user.cover_ref
            },
            messagetype: message.type,
            content: message.content,
            createDate: message.createDate,
            targetId: req.params.group
          }

          group.members.forEach(function(uid){
            if (uid == req.user.id) { return; }

            var room = sio.sockets.adapter.rooms[uid];
            if (room) {
              payload.aps = {alert: alertMessage};
              sio.to(uid).emit(payload.type, payload);
              // console.log("socket:"+uid);
            } else {
              pushMembers.push(uid);
              // console.log("push:"+uid);
            }
          });
          // console.log("pushlist:");
          // console.log(pushMembers);

          Push(req.user.id, pushMembers, payload, alertMessage, function(err, apnNotification){
            console.log("======== apn callback ========");
            console.log(arguments);
            console.log("======== apn callback ========");
            if (err) next(err);
          });
        });

        callback(null, message);
      }

    ], function(err, message) {
      if (err) next(err);
      else res.json(message);
    });

  };
};
