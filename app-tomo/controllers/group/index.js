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

        // groups can display on map
        if (req.query.category == "map")
          query.where('_id').in(req.user.groups)
            .where('coordinate').exists(true);

        // groups name match some string
        if (req.query.name)
          query.where('name').regex('^.*'+req.query.name+'.*$')

        // groups near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate
          });
        else
          query.sort('-createDate')

        // groups in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

        // if (req.query.page)
        //   query.skip(20 * req.query.page)

        query.select('owner type name cover introduction coordinate address station members posts')
          .populate('owner', 'nickName photo cover')
          .populate('station', 'name line coordinate')
          .where('logicDelete').equals(false)
          // .limit(req.query.size || 20)
          .exec(callback);
      },

      function populatePosts(groups, callback) {

        if (req.query.category == "mine")
          async.map(groups, function(group, callback) {
            if (group.posts.length)
              Post.find()
                .select('owner group content images like bookmark comments coordinate createDate')
                .where('_id').in(group.posts)
                .where('logicDelete').equals(false)
                .populate('owner', 'nickName photo cover')
                .populate('group', 'name')
                .populate('comments.owner', 'nickName photo cover')
                .limit(3)
                .sort('-createDate')
                .exec(function(err, posts) {
                  if (err) callback(err);
                  else {
                    group = group.toObject();
                    group.posts = posts;
                    callback(null, group);
                  }
                });
              else callback(null, group);
          }, callback);
        else
          callback(null, groups);
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
