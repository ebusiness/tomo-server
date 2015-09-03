var apns = require('apn'),
    User = require('mongoose').model('User');
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

  receivers.forEach(function(receiver) {
    var device = new apns.Device(receiver.device.token);
    note.badge = 1;
    note.device = device;
    apnsConnection.sendNotification(note);
  });

  //
	// for (var i = users.length - 1; i >= 0; i--) {
  //   	var user = users[i];
  //
  //       if(sio.sockets.clients(user.id).length < 1 ){
  //
  //       	var devices = user.devices;
  //           for (var j = devices.length - 1; j >= 0; j--) {
  //           	var device = devices[j];
  //               if(device.token){
  //
  //                   //push
  //       					var apnsConnection = new apns.Connection(options);
  //       					var device = new apns.Device(device.token);
  //       					var note = new apns.Notification();
  //       					note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  //       					note.badge = 1;
  //       					note.sound = "ping.aiff";
  //       					note.alert = alertMessage;
  //       					note.payload = payload;
  //       					note.device = device;
  //       					apnsConnection.sendNotification(note);
  //               }
  //           };
  //       }else if (onlinefunc){
  //   		//console.log("onlinefunc");
  //       	onlinefunc(user);
  //       }
  //
  //   };
}
