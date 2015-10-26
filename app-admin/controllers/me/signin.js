var async = require('async');

module.exports = function(User) {

  return function(req, res, next) {

    // do nothing if login info are not enough
    if (!req.body.email || !req.body.password) {
      var err = new Error('Invalid Parameter');
      err.status = 400;
      next(err);
      return;
    }

    async.waterfall([

      function(callback) {
        User.findOne(req.body)
          .select('firstName lastName nickName photo cover birthDay gender telNo address bio friends invitations groups pushSetting')
          .where('type').equals('admin')
          .exec(callback);
      }

    ], function(err, user) {

      if (err) next(err);
      if (user == null) {
        var err = new Error('User Not Found');
        err.status = 404;
        next(err);
      } else {
        // put user's id into session
        req.session.userId = user.id;
        res.json(user);
      }

    });

  };
};
