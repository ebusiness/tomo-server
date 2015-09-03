var async = require('async');

module.exports = function(User, Invitation, Message) {

  return function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
      return;
    }

    async.waterfall([

      function(callback) {
        User.findOne(req.body)
          .select('firstName lastName nickName photo cover birthDay gender telNo address bio friends invitations')
          .where('type').equals('user')
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



    // else
    // // look up user info
    //   User.findOne(req.body)
    //     .select('firstName lastName nickName photo cover birthDay gender telNo address bio friends invitations')
    //     .where('type').equals('user')
    //     .exec(function(err, user) {
    //
    //       // pass if error happend
    //       if (err) next(err);
    //       // if the account not found, return the fail status
    //       else if (!user) {
    //         var err = new Error('Invalid Credential');
    //         err.status = 401;
    //         next(err);
    //       }
    //       // if account could be found
    //       else {
    //         // put user's id into session
    //         req.session.userId = user.id;
    //         // send user info back
    //         res.json(user);
    //       }
    //     });

  };
};
