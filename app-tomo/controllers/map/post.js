var async = require('async'),
    moment = require('moment');

module.exports = function(Post, Group) {

  return function(req, res, next) {

    async.waterfall([

      function findPosts(callback) {

        // create query
        var query = Post.find();

        // posts near some coordinate
        if (req.query.coordinate)
          query.where('coordinate').near({
            center: req.query.coordinate
          });

        // posts in a box
        if (req.query.box)
          query.where('coordinate').within({
            box: [[req.query.box[0], req.query.box[1]], [req.query.box[2], req.query.box[3]]]
          });

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
          // .populate('comments.owner', 'nickName photo cover')
          .where('coordinate').exists(true)
          .where('logicDelete').equals(false)
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
