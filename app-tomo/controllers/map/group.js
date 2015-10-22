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

        // groups of some type
        if (req.query.type)
          query.where('type').equals(req.query.type);

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
          query.where('name').regex('^.*'+req.query.name+'.*$')

        if (req.query.page)
          query.skip(20 * req.query.page)
            .limit(req.query.size || 20);

        query.select('owner type name cover introduction coordinate address members posts')
          .where('posts.1').exists(true)
          .where('logicDelete').equals(false)
          .exec(callback);
      },

      // function countNewPosts(groups, callback) {
      //
      //   async.map(groups, function(group, callback) {
      //
      //     // create query
      //     var query = Post.find();
      //
      //     // posts after some timestamp
      //     if (req.query.after)
      //       query.where('createDate').gte(moment.unix(req.query.after).startOf('week'));
      //
      //     query.select('owner group content images like bookmark comments location coordinate createDate')
      //       .where('_id').in(group.posts)
      //       .where('logicDelete').equals(false)
      //       .exec(function(err, posts) {
      //         if (err) callback(err);
      //         else {
      //           group = group.toObject();
      //           group.posts = posts;
      //           callback(null, group);
      //         }
      //       });
      //
      //   }, callback);
      //
      // }

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
