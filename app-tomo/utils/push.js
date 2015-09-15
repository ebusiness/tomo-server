var apns = require('apn'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Message = mongoose.model('Message'),
    Invitation = mongoose.model('Invitation'),
    Notification = mongoose.model('Notification');
/*
  payload = {
    type: String,  // post-new, message-new, post-commented, friend-invited, friend-approved, friend-declined, announcement
    id: String     // PostId,   SenderId,    PostId,         SenderId,       SenderId,        SenderId,        AnnouncementId
  }
*/

module.exports = function(sender, receiver, payload, alertMessage, callback) {

	if (!receiver) {
    callback(null);
    return;
  }

  User.find()
    .select('device')
    .where('_id').in(receiver)
    .where('_id').ne(sender)
    .where('device.token').exists(true)
    .where('logicDelete').equals(false)
    .exec(function(err, recipients) {
      if (err) callback(err);
      else send(recipients, payload, alertMessage, callback);
    });
}

module.exports.all = function(sender, payload, alertMessage, callback){

  User.find()
    .select('device')
    .where('_id').ne(sender)
    .where('device.token').exists(true)
    .where('logicDelete').equals(false)
    .exec(function(err, recipients) {
      if (err) callback(err);
      else send(recipients, payload, alertMessage, callback);
    });
}

function send(receivers, payload, alertMessage, callback){

  var options = config.apn;
    options.errorCallback = callback;

  var apnsConnection = new apns.Connection(options);
  var note = new apns.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.sound = "ping.aiff";
  note.alert = alertMessage;
  note.payload = payload;

  receivers.forEach(function(user) {

    async.parallel({

      invitations: function(callback) {
        Invitation.count()
          .where('to').equals(user.id)
          .where('type').equals('friend')
          .where('result').equals(null)
          .where('logicDelete').equals(false)
          .exec(callback);
      },

      messages: function(callback) {
        Message.count()
          .where('to').equals(user.id)
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
        var device = new apns.Device(user.device.token);
        note.badge = result.invitations + result.messages + result.notifications;
        note.device = device;
        apnsConnection.sendNotification(note);
      }
    });

  });
};
