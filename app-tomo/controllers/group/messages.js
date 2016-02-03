var async = require('async'),
    moment = require('moment');

module.exports = function(Message) {

  return function(req, res, next) {
    var groups = req.user.groups.toObject()
    if ( !groups.indexOf(req.params.group) ){
      res.status(403).end();
      return;
    }

    async.parallel({

      openMessages: function(callback) {
        Message.where('group').equals(req.params.group)
          .where('opened').ne(req.user.id)
          .where('logicDelete').equals(false)
          .setOptions({ multi: true })
          .update({ $addToSet: {opened: req.user.id} }, callback);
      },

      messages: function(callback) {

        // create query
        var query = Message.find();

        // if request items before some time point
        if (req.query.before)
          query.where('createDate').lt(moment.unix(req.query.before).toDate());

        query.select('from to type content opened createDate')
          .populate('from', 'nickName photo')
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
