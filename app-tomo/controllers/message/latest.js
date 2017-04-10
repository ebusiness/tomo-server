var async = require('async'),
    moment = require('moment');

module.exports = function(User, Group, Message) {

  return function(req, res, next) {

    async.parallel({

      single: function(callback) {

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
            group: {$first: "$group"},
            project: {$first: "$project"},
            company: {$first: "$company"}
          })
          .project({
            _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1, project: 1, company: 1
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

      group: function(callback) {
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
            group: {$first: "$group"},
            project: {$first: "$project"},
            company: {$first: "$company"}
          })
          .project({
            _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1, project: 1, company: 1
          })
          .exec(function(err, messages) {

            if (err) callback(err);
            else {
              Group.populate(messages, {path: 'group', select: 'cover name'}, callback);
            }
          });
      },

      project: function(callback) {
        var ids = [];
        req.user.experiences.forEach(function(experience) {
            if (ids.indexOf(experience.project._id) == -1) {
                ids.push(experience.project._id);
            }
        });
        Message.aggregate()
          .match({ project: {$ne: null} })
          .match({ project: {$in: ids} })
          .sort({ createDate: -1 })
          .group({
            _id: "$project",
            content: {$first: "$content"},
            to: {$first: "$to"},
            from: {$first: "$from"},
            createDate: {$first: "$createDate"},
            opened: {$first: "$opened"},
            type: {$first: "$type"},
            group: {$first: "$group"},
            project: {$first: "$project"},
            company: {$first: "$company"}
          })
          .project({
            _id: 0, content: 1, to: 1, from: 1, createDate: 1, type: 1, group: 1, project: 1, company: 1
          })
          .exec(function(err, messages) {

            if (err) callback(err);
            else {
              Group.populate(messages, {path: 'group', select: 'cover name'}, callback);
            }
          });
      },

      company: function(callback) {
          callback(null, null);
      }

    }, function(err, result) {

      if (err) next(err);
      else {

        var messages = result.single.concat(result.group).concat(result.project).concat(result.company);

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
