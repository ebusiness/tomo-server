var async = require('async'),
    moment = require('moment');

module.exports = function(Post, User, Project, Company) {

  return function(req, res, next) {

    async.waterfall([

      function findRelateObject(callback) {

        async.parallel({

          user: function(callback) {
            if (req.params.user) {
                if (!mongoose.Types.ObjectId.isValid(req.params.user)) {
                  res.status(412).end();
                  return;
                }
                User.findById(req.params.user, 'posts', callback);
            } else {
                callback(null, null);
            }
          },

          project: function(callback) {
            if (req.params.project) {
                if (!mongoose.Types.ObjectId.isValid(req.params.project)) {
                  res.status(412).end();
                  return;
                }
                Project.findById(req.params.project, 'posts', callback);
            } else {
                callback(null, null);
            }
          },

          company: function(callback) {
            if (req.params.company) {
                if (!mongoose.Types.ObjectId.isValid(req.params.company)) {
                  res.status(412).end();
                  return;
                }
                Company.findById(req.params.company, 'posts', callback);
            } else {
                callback(null, null);
            }
          }

        }, callback);
      },

      function findPosts(relateObj, callback) {
        // create query
        var query = Post.find();

        // posts of some one
        if (relateObj.user)
          query.where('_id').in(relateObj.user.posts);

        // posts of some project
        if (relateObj.project)
          query.where('_id').in(relateObj.project.posts);

        // posts of some company
        if (relateObj.company)
          query.where('_id').in(relateObj.company.posts);

        // posts of mine
        if (req.query.category == "mine")
          query.where('_id').in(req.user.posts);

        // posts before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        // posts after some time point
        if (req.query.after)
          query.where('createDate').gt(moment.unix(req.query.after).toDate());

        query.select('-logicDelete')
          .populate('owner', 'nickName photo cover')
          .populate('like', 'nickName photo')
          .populate('project')
          .populate('company')
          .populate('comments.owner', 'nickName photo')
          .where('logicDelete').equals(false)
          .limit(req.query.size || 10)
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
