var async = require('async');

module.exports = function(User, Group, Message) {

  return function(req, res, next) {
    async.waterfall([
      function findContacts(callback){
        async.parallel({

          groups: function(callback) {
            Group.find()
              .where('_id').in(req.user.groups)
              .where('logicDelete').equals(false)
              .exec(callback);
          },
          friends: function(callback) {
            User.find()
              .select('nickName firstName lastName photo cover birthDay gender telNo address bio')
              .where('_id').in(req.user.friends)
              .where('logicDelete').equals(false)
              .exec(callback);
          }

        }, callback);
      },
      function appendLastMessage(relateObj, callback) {
        if (relateObj.friends.length === 0 && relateObj.groups.length === 0){
          var err = new Error('Not Found');
          err.status = 404;
          callback(err);
        } else {
          async.parallel({

            groups: function(callback) {
                async.map(relateObj.groups, function(group, callback) {
                  Message.findOne()
                    .select('type content createDate')
                    .where('group').equals(group.id)
                    .where('logicDelete').equals(false)
                    .sort('-createDate')
                    .exec(function(err, message) {
                      if (err) callback(err);
                      else {
                        group = group.toObject();
                        group.lastMessage = message;
                        callback(null, group)
                      }
                    });
                }, callback);
            },
            friends: function(callback) {
                async.map(relateObj.friends, function(friend, callback) {
                  Message.findOne()
                    .select('type content createDate')
                    .where('from').in([req.user.id, friend.id])
                    .where('to').in([req.user.id, friend.id])
                    .where('logicDelete').equals(false)
                    .sort('-createDate')
                    .exec(function(err, message) {
                      if (err) callback(err);
                      else {
                        friend = friend.toObject();
                        friend.lastMessage = message;
                        callback(null, friend)
                      }
                    });
                }, callback);
            }

          }, callback);
        }
      }

    ], function(err, friends) {
      if (err) next(err);
      else res.json(friends);
    });

  };
};
