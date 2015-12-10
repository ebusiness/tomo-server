var apns = require('apn'),
async = require('async'),
mongoose = require('mongoose');

module.exports = function(User) {

    return function(req, res, next) {

        User.findById(req.params.user, function(err, user) {
            if (err) next(err);
            else {
                if (!user.device.token) {
                    var err = new Error('No device found');
                    err.status = 404;
                    next(err);
                }

                var notification = req.body;

                var options = config.apn;

                options.errorCallback = function (myError) {
                    console.log(arguments);
                }

                var apnsConnection = new apns.Connection(options);
                var note = new apns.Notification();
                note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
                note.alert = notification.alert.body;
                note.badge = notification.badge;
                note.sound = notification.sound;
                note.category = notification.category;
                // note.payload = {
                //     'messageFrom': 'Tom'
                // };

                var device = new apns.Device(user.device.token);
                note.device = device;
                apnsConnection.sendNotification(note);

                var result = {
                    status: "send ok"
                }
                res.send(result);
            }
        });
    };
};
