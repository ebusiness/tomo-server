var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose');

module.exports = function(User, Project) {

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

    var projects = [];
    var invalid = true;
    req.body.forEach(function(experience) {
      if(!experience.project || !mongoose.Types.ObjectId.isValid(experience.project)) {
        invalid = false;
      } else {
        projects.push(experience.project);
      }
    });
    if(!invalid) {
        res.status(412).end();
        return;
    }

    async.waterfall([
      function findRelateInfo(callback) {
          async.parallel({

            removed: function (callback) {
              var ids = [];
              req.user.experiences.forEach(function(experience) {
                  if (projects.indexOf(experience.project._id+"") == -1) {
                      ids.push(experience.project._id);
                  }
              });
              callback(null, ids);
            },

            added: function (callback) {
              var oldids = [];
              req.user.experiences.forEach(function(experience) {
                  oldids.push(experience.project._id+"");
              });
              var ids = [];
              projects.forEach(function(id) {
                  if (oldids.indexOf(id) == -1) {
                      ids.push(id);
                  }
              });
              callback(null, ids);
            }

          }, callback);
      },

      function updateRelateInfo(relateInfo, callback) {

        async.parallel({

          remove: function (callback) {
              console.log(relateInfo);
              Project.update({ '_id': {'$in': relateInfo.removed} }, { '$pull': {'members': req.user.id} }, { multi: true }, callback);
          },

          add: function(callback) {
              Project.update({ '_id': {'$in': relateInfo.added} }, { '$addToSet': {'members': req.user.id} }, { multi: true }, callback);
          }

        }, function(err, relateInfo) {
          if (err) callback(err);
          else callback(null, relateInfo);
        });
      },

      function updateUserInfo(relateInfo, callback) {
          // req.user.experiences = req.body;
          // req.user.save(callback);
          User.findByIdAndUpdate(req.user.id, {"experiences": req.body}, { new: true }, callback);
      }

    ], function(err, user) {
      if (err) next(err);
      else {
        res.json(user.experiences);
      }
    });
  };
};
