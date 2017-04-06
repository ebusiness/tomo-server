var async = require('async'),
    moment = require('moment');

module.exports = function(User, Group, Message) {

  return function(req, res, next) {

    async.parallel({

      singleChatMessages: function(callback) {

        Message.aggregate()
          .match({ group: null })
          .match({
            $or: [
              {$and: [{to: req.user._id}, {from: {$in: req.user.friends}}]},
              {$and: [{from: req.user._id}, {to: {$in: req.user.friends}}]}
            ]
          })
          .sort({ createDate: -1 })
          .group({
            _id: {
              $cond: { if: { $eq: ["$from", req.user._id] }, then: "$to", else: "$from" }
            },
            content: {$first: "$content"},
            to: {$first: "$to"},
            from: {$first: "$from"},
            createDate: {$first: "$createDate"},
            opened: {$first: "$opened"},
            type: {$first: "$type"},
            group: {$first: "$group"}
          })
          .project({
            _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1
          })
          .exec(function(err, messages) {

            if (err) callback(err);
            else {
              User.populate(messages, [
                {path: 'to', select: 'photo nickName'},
                {path: 'from', select: 'photo nickName'}
              ], callback);
            }
          });
      },

      groupChatMessages: function(callback) {
        var groupIds = [];
        if(req.user.groups && req.user.groups.length > 0){
          req.user.groups.forEach(function(group){
            groupIds.push(group.group._id)
          });
        }
        Message.aggregate()
          .match({ group: {$ne: null} })
          .match({ group: {$in: groupIds} })
          .sort({ createDate: -1 })
          .group({
            _id: "$group",
            content: {$first: "$content"},
            to: {$first: "$to"},
            from: {$first: "$from"},
            createDate: {$first: "$createDate"},
            opened: {$first: "$opened"},
            type: {$first: "$type"},
            group: {$first: "$group"}
          })
          .project({
            _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1
          })
          .exec(function(err, messages) {

            if (err) callback(err);
            else {
              Group.populate(messages, {path: 'group', select: 'cover name'}, callback);
            }
          });
      }

    }, function(err, result) {

      if (err) next(err);
      else {

        var messages = result.singleChatMessages.concat(result.groupChatMessages);

        if (messages.length == 0) {
          var err = new Error('All Message Loaded');
          err.status = 404;
          next(err);
        } else res.json(messages);
      }
    });

    // Message.aggregate()
    //   .match({ $or: [{to: req.user._id}, {from: req.user._id}] })
    //   .sort({createDate: -1})
    //   .group({
    //     _id: {
    //       $cond: { if: { $eq: ["$from", req.user._id] }, then: "$to", else: "$from" }
    //     },
    //     content: {$first: "$content"},
    //     to: {$first: "$to"},
    //     from: {$first: "$from"},
    //     createDate: {$first: "$createDate"},
    //     opened: {$first: "$opened"},
    //     type: {$first: "$type"},
    //     group: {$first: "$group"}
    //   })
    //   .project({
    //     _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1
    //   })
    //   .exec(function(err, messages) {
    //     if (err) next(err);
    //     else if (messages.length == 0) {
    //       var err = new Error('All Message Loaded')
    //       err.status = 404;
    //       next(err);
    //     } else {
    //
    //       User.populate(messages, [
    //         {path: 'to', select: 'photo nickName'},
    //         {path: 'from', select: 'photo nickName'}
    //       ], function(err, messages) {
    //         if (err) next(err);
    //         else res.json(messages);
    //       });
    //     }
    //   });

  };
};
