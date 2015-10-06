var async = require('async'),
    moment = require('moment');

module.exports = function(Group, Post) {

  return function(req, res, next) {

    async.waterfall([

      function findGroups(callback) {

        // create query
        var query = Group.find();

        // discover groups
        if (req.query.category == "discover")
          query.where('_id').nin(req.user.groups);

        // groups of mine
        if (req.query.category == "mine")
          query.where('_id').in(req.user.groups);

        // groups near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate
          });

        // groups in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

        query.select('owner type name cover introduction coordinate address station members posts')
          .populate('owner', 'nickName photo cover')
          // .populate('station', 'name line coordinate')
          .where('coordinate').exists(true)
          .where('logicDelete').equals(false)
          .exec(callback);
      },

      function populatePosts(groups, callback) {

        async.reduce(groups, [], function(result, group, callback) {

          if (group.posts.length) {

            // create query
            var query = Post.find();

            // posts of some day
            if (req.query.date) {
              query.where('createDate').gte(moment.unix(req.query.date).startOf('day'));
              query.where('createDate').lte(moment.unix(req.query.date).endOf('day'));
            }

            // posts of today
            if (req.query.mode == 'today') {
              query.where('createDate').gte(moment().startOf('day'));
              query.where('createDate').lte(moment().endOf('day'));
            }

            // posts of this week
            if (req.query.mode == 'thisWeek') {
              query.where('createDate').gte(moment().startOf('isoWeek'));
              query.where('createDate').lte(moment().endOf('isoWeek'));
            }

            // posts of this month
            if (req.query.mode == 'thisMonth') {
              query.where('createDate').gte(moment().startOf('month'));
              query.where('createDate').lte(moment().endOf('month'));
            }

            query.select('owner group content images like bookmark comments location coordinate createDate')
              .populate('owner', 'nickName photo cover')
              .populate('group', 'name')
              .where('_id').in(group.posts)
              .where('logicDelete').equals(false)
              .exec(function(err, posts) {
                if (err) callback(err);
                else if (posts.length == 0) callback(null, result);
                else {
                  group = group.toObject();
                  group.posts = posts;
                  result.push(group);
                  callback(null, result);
                }
              });
          } else callback(null, result)

        }, callback);
      }

    ], function(err, groups) {
      if (err) next(err);
      else if (groups.length === 0) {
        var err = new Error('All Group Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(groups);
      }
    });

  };
};
