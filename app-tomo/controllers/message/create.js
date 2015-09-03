var async = require('async'),
    Push = require('../../utils/push');

module.exports = function(User, Message, Activity) {

  return function(req, res, next) {

    async.waterfall([

      function createMessage(callback) {
        req.body.from = req.user.id;
        Message.create(req.body, callback)
      },

      function createActivity(message, callback) {
        Activity.create({
          owner: req.user.id,
          type: 'message-new',
          targetMessage: message.id
        }, function(err, activity) {
          if (err) callback(err);
          else callback(null, message);
        });
      },

      // function sendNotification(info, callback) {
      //
      // }

    ], function(err, message) {
      if (err) next(err);
      else res.json(message);
    });



    // req.body.from = req.user.id;
    //
    // Message.create(req.body, function(err, message) {
    //
    //     if (err) next(err);
    //     else {
    //
    //         // log user's activity
    //         createActivity(req.user.id,message._id,next);
    //
    //         // populate the message with user's info
    //         message.populate({path:'_from', select: 'type firstName lastName title cover photo createDate'}, function(err, msg) {
    //
    //             if(err) next(err);
    //             else {
    //                 // send real time message
    //                 var recipient = (group) ? group.announcelist : msg._recipient;
    //                 if (!recipient){return;}
    //                 var alertMessage = req.user.nickName + " : " ;
    //                 var reg_content = /^(\[(音声|画像|動画)\]).*$/i;
    //
    //                 if (reg_content.test(msg.content)){
    //                     alertMessage += msg.content.replace(reg_content,"$1");
    //                 }else{
    //                     alertMessage += msg.content;
    //                 }
    //
    //                 var payload = {
    //                   type: 'message-new',
    //                   id: req.user.id
    //                 };
    //
    //                 Push(req.user.id, recipient, payload, alertMessage, function(user){
    //                     if (req.user.id != user.id )
    //                         sio.sockets.in(user.id).emit('message-new', msg);
    //                 });
    //                 res.json(msg);
    //             }
    //         });
    //
    //     }
    // });

  };
};