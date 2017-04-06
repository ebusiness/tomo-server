var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Group, Message, Activity, sio) {

  return function(req, res, next) {

    if ( !req.params.group ){
      res.status(412).end();
      return;
    }

    var groupIds = [];
    if(req.user.groups && req.user.groups.length > 0){
      req.user.groups.forEach(function(group){
        groupIds.push(group.group._id)
      });
    }
    if ( !groupIds.indexOf(req.params.group) ){
      res.status(403).end();
      return;
    }

    async.waterfall([

      function createMessage(callback) {
        req.body.from = req.user.id;
        req.body.group = req.params.group;
        req.body.opened = [req.user.id];
        Message.create(req.body, callback)
      },

      function sendNotification(message, callback) {

        var pushMembers = [];
        Group.findById(req.params.group, function(err, group) {

          var alertMessage = req.user.nickName ;

          if (message.type == "voice") {
            alertMessage += "在" + group.name + "中发送了一段语音";
          } else if(message.type == "photo") {
            alertMessage += "在" + group.name + "中发送了一张图片";
          } else if(message.type == "video") {
            alertMessage += "在" + group.name + "中发送了一段视频";
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
            group: {
              id: req.params.group,
              name: group.name,
              cover: group.cover_ref
            },
            createDate: message.createDate
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

          Push(req.user.id, pushMembers, payload, alertMessage, function(err, apnNotification) {
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
