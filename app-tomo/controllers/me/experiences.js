module.exports = function(User) {

  return function(req, res, next) {
    // req.body = [{
    //   project:"58e70d021a244f57096062d6",
    //   to:"2017-04-01T08:07:11.348Z",
    //   from:"2016-04-01T08:07:11.348Z",
    //   work: {
    //     SUP: true,
    //     OM: false,
    //     ST: true,
    //     IT: true,
    //     UT: true,
    //     CD: true,
    //     DD: true,
    //     BD: true,
    //     SA: true,
    //     RFP: true
    //     }
    // }];
    if(!req.body) {
        res.status(412).end();
        return;
    }
    var invalid = true;
    req.body.forEach(function(experience) {
      if(!experience.project) {
        invalid = false;
      }
    });
    if(!invalid) {
        res.status(412).end();
        return;
    }

    User.findByIdAndUpdate(req.user.id, {"experiences": req.body}, { new: true }, function(err, user) {
      if (err) next(err);
      else res.json(user.experiences);
    });

  };
};
