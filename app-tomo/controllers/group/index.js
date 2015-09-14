var async = require('async'),
    moment = require('moment');

module.exports = function(Group) {

  return function(req, res, next) {

    async.waterfall([

      function findPosts(callback) {

        // create query
        var query = Group.find();

        // group of mine
        if (req.query.category == "mine")
          query.where('_id').in(req.user.groups);

        // group can be displayed on map
        if (req.query.category == "mapgroup")
          query.where('coordinate').exists(true);

        query.select('owner type name cover introduction coordinate address members posts')
          .populate('owner', 'nickName photo cover')
          .where('logicDelete').equals(false)
          .limit(req.query.size || 20)
          .sort('-createDate')
          .exec(callback);
      }

    ], function(err, posts) {
      if (err) next(err);
      else if (posts.length === 0) {
        var err = new Error('All Post Loaded');
        err.status = 404;
        next(err);
      } else {
        res.json(posts);
      }
    });

  };
};
