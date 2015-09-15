var async = require('async'),
    moment = require('moment');

module.exports = function(Notification) {

  return function(req, res, next) {

    async.parallel({

      openNotification: function(callback) {
        Notification.where('to').equals(req.user.id)
          .where('confirmed').ne(req.user.id)
          .where('logicDelete').equals(false)
          .setOptions({ multi: true })
          .update({$addToSet: {confirmed: req.user.id}}, callback);
      },

      notifications: function(callback) {

        // create query
        var query = Notification.find();

        // notifications are relate with current user
        query.where('to').equals(req.user.id);

        // if request items before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        query.select('-logicDelete')
          .where('logicDelete').equals(false)
          .populate('from', 'nickName photo cover')
          .limit(req.query.size || 20)
          .sort('-createDate')
          .exec(callback);
      }

    }, function(err, result) {
      if (err) next(err);
      else if (result.notifications.length === 0) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
      } else res.json(result.notifications);
    });

  };
};
