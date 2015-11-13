var async = require('async'),
    moment = require('moment'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

module.exports = function(Activity) {

  return function(req, res, next) {

    var aggregate = Activity.aggregate();

    // statistis of some user
    if (req.query.user)
      aggregate.match({owner: ObjectId(req.query.user)});

    // type of activity
    if (req.query.types && Array.isArray(req.query.types)) {
      var types = [];
      req.query.types.forEach(function(type) {
        types.push({type: type})
      });
      aggregate.match({$or: types});
    } else if (req.query.types && (typeof req.query.types) == "string") {
      aggregate.match({type: req.query.types});
    }

    // duration end point
    if (req.query.before)
      aggregate.match({
        createDate: {$lte: moment(Number(req.query.before)).toDate()}
      });

    // duration start point
    if (req.query.after)
      aggregate.match({
        createDate: {$gte: moment(Number(req.query.after)).toDate()}
      });

    // begin aggregation
    aggregate.project({
      date: {$dateToString: { format: "%Y-%m-%d", date: "$createDate" }},
      type: 1,
      count: 1
    })
    .group({
      _id : {date: "$date", type: "$type"},
      count: { $sum: 1 }
    })
    .project({
      _id: 0,
      date: "$_id.date",
      type: "$_id.type",
      count: 1
    })
    .sort({date: 1})
    .exec(function(err, data) {
      if (err) next(err);
      else res.json(data);
    });

  };
};
