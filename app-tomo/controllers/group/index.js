var _ = require('lodash'),
    async = require('async'),
    moment = require('moment');

module.exports = function(Group, Post) {

  return function(req, res, next) {

    async.waterfall([

      function findGroups(callback) {
        var groupIds = [];
        if(req.user.groups && req.user.groups.length > 0){
          req.user.groups.forEach(function(group){
            groupIds.push(group.group._id)
          });
        }

        // create query
        var query = Group.find();

        // discover groups
        if (req.query.category == "discover")
          query.where('_id').nin(groupIds);

        // groups of mine
        if (req.query.category == "mine")
          query.where('_id').in(groupIds);

        // groups of some type
        // if (req.query.type)
        //   query.where('type').equals(req.query.type);

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

        // groups name match some string
        if (req.query.name)
          query.where('name').regex('^.*'+req.query.name+'.*$');

        // groups that has posts
        if (req.query.hasPosts)
          query.where('posts.0').exists(true);

        // groups that has members
        if (req.query.hasMembers)
          query.where('members.0').exists(true);

        if (req.query.page)
          query.skip(20 * req.query.page)
            .limit(req.query.size || 20);

        query.select('owner type name cover introduction coordinate pref address members posts companies')
          .populate('owner', 'nickName photo cover')
          .populate('members', 'nickName photo cover')
          .populate('companies.si')
          .populate('companies.end')
          .where('logicDelete').equals(false)
          // .sort('-createDate')
          .exec(callback);
      },

      function countPosts(groups, callback) {

        if (req.query.after) {

          var groupIds = _.pluck(groups, '_id');

          Post.aggregate()
            .match({group: {$in: groupIds}})
            .match({createDate: {$gte: moment.unix(req.query.after).toDate()}})
            .group({_id: '$group', posts: {$push: '$_id'}})
            .exec(function(err, counts) {
              if (err) callback(err);
              else {
                groups = _.map(groups, Group.toObject);
                groups.forEach(function(group) {
                  var found = _.find(counts, {_id: group._id});
                  if (found) group.posts = found.posts;
                  else group.posts = [];
                });
                callback(null, groups);
              }
            });

        } else callback(null, groups);

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
