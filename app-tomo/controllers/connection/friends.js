var async = require('async');

module.exports = function(User, Message) {

  return function(req, res, next) {

    User.find()
      .select('nickName firstName lastName photo cover birthDay gender telNo address bio')
      .where('_id').in(req.user.friends)
      .where('logicDelete').equals(false)
      .sort('-createDate')
      .exec(function(err, users) {
        if (err) next(err);
        else if (users.length == 0) {
          var error = new Error('Not Found')
          error.status = 404;
          next(error);
        } else res.json(users);
      });

    // async.waterfall([
    //
    //   function findFriends(callback) {
    //     User.find()
    //       .select('nickName firstName lastName photo cover birthDay gender telNo address bio')
    //       .where('_id').in(req.user.friends)
    //       .where('logicDelete').equals(false)
    //       .sort('-createDate')
    //       .exec(callback);
    //   },
    //
    //   function appendLastMessage(friends, callback) {
    //
    //     if (friends.length === 0) {
    //       var err = new Error('Not Found');
    //       err.status = 404;
    //       callback(err);
    //
    //     } else {
    //
    //       async.map(friends, function(friend, callback) {
    //         Message.findOne()
    //           .select('type content createDate')
    //           .where('from').in([req.user.id, friend.id])
    //           .where('to').in([req.user.id, friend.id])
    //           .where('logicDelete').ne(req.user.id)
    //           .sort('-createDate')
    //           .exec(function(err, message) {
    //             if (err) callback(err);
    //             else {
    //               friend = friend.toObject();
    //               friend.lastMessage = message;
    //               callback(null, friend)
    //             }
    //           });
    //       }, callback);
    //     }
    //   }
    //
    // ], function(err, friends) {
    //   if (err) next(err)
    //   else res.json(friends);
    // });

  };
};
