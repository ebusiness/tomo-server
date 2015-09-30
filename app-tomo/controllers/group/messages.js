var async = require('async'),
    moment = require('moment');

module.exports = function(GroupMessage) {

  return function(req, res, next) {
    var groups = req.user.groups.toObject()
    if ( !groups.indexOf(req.params.group) ){
      res.status(403).end();
      return;
    }

    async.parallel({

      openMessages: function(callback) {
        GroupMessage.where('group').equals(req.params.group)
          .where('opened').equals(req.user.id)
          .where('logicDelete').equals(false)
          .setOptions({ multi: true })
          .update({ $addToSet: {opened: req.user.id} }, callback);
      },

      messages: function(callback) {

        // create query
        var query = GroupMessage.find();

        // if request items before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        query.select('from to content opened createDate')
          .where('group').equals(req.params.group)
          .where('logicDelete').equals(false)
          .limit(req.query.size || 20)
          .sort('-createDate')
          .exec(callback);
      }

    }, function(err, result) {
      if (err) next(err);
      else if (result.messages.length === 0) {
        var err = new Error('All Message Loaded')
        err.status = 404;
        next(err);
      } else res.json(result.messages);
    });

  };
};
