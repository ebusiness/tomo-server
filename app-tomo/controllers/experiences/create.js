var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose');

module.exports = function(User, Project, Company) {

  return function(req, res, next) {
    // req.body = {
    //   project: "58e70d021a244f57096062d6",
    //   company: "58e70cfe3e54c24d0927ff87",
    //   to: "2017-04-01T08:07:11.348Z",
    //   from: "2016-04-01T08:07:11.348Z",
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
    // };
    if(!req.body.project || !req.body.company || !req.body.from || !req.body.work) {
        res.status(412).end();
        return;
    }

    if(!req.body.work.SUP &&
        !req.body.work.OMP &&
        !req.body.work.STP &&
        !req.body.work.ITP &&
        !req.body.work.UTP &&
        !req.body.work.CDP &&
        !req.body.work.DDP &&
        !req.body.work.BDP &&
        !req.body.work.SAP &&
        !req.body.work.RFP) {

        res.status(412).end();
        return;
    }
    if(!mongoose.Types.ObjectId.isValid(req.body.project) ||
      !mongoose.Types.ObjectId.isValid(req.body.company)) {
      res.status(412).end();
      return;
    }

    async.waterfall([
      function findRelateInfo(callback) {
          async.parallel({

            company: function (callback) {
              Company.findById(req.body.company, callback);
            },

            project: function (callback) {
              Project.findById(req.body.project, callback);
            },

            user: function (callback) {
              User.findById(req.user.id, callback);
            }

          }, callback);
      },
      function updateRelateInfo(relateInfo, callback) {
          async.parallel({

            company: function (callback) {
                relateInfo.company.projects.addToSet(relateInfo.project.id);
                relateInfo.company.save(callback);
            },

            project: function (callback) {
                relateInfo.project.relCompanies.addToSet(relateInfo.company.id);
                relateInfo.project.members.addToSet(req.user.id);
                relateInfo.project.save(callback);
            },

            experience: function (callback) {
                if (!relateInfo.user.experiences || !relateInfo.user.experiences.length) {
                    relateInfo.user.experiences = [];
                }
                var experience = relateInfo.user.experiences.create(req.body);
                relateInfo.user.experiences.push(experience);
                relateInfo.user.save(function(err, user){
                    if (err) callback(err);
                    else callback(null, experience);
                });
            }

          }, callback);

      }

    ], function(err, relateInfo) {
      if (err) next(err);
      else {
        res.json(relateInfo.experience);
      }
    });
  };
};
