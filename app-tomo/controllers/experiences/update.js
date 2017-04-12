var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

module.exports = function(User, Project, Company) {

  return function(req, res, next) {
    // req.body = {
    //   project: "58e70d021a244f57096062d6",
    //   company: "58e70cfe3e54c24d0927ff87",
    //   to: "2017-04-01T08:07:11.348Z",
    //   from: "2016-04-01T08:07:11.348Z",
    //   work: {
    //     SUP: false,
    //     OM: false,
    //     ST: false,
    //     IT: false,
    //     UT: false,
    //     CD: false,
    //     DD: false,
    //     BD: false,
    //     SA: false,
    //     RFP: false
    //     }
    // };
    if(!req.params.experience || !ObjectId.isValid(req.params.experience)) {
      res.status(412).end();
      return;
    }

    if(req.body.project && !mongoose.Types.ObjectId.isValid(req.body.project)) {
      res.status(412).end();
      return;
    }

    if(req.body.company && !mongoose.Types.ObjectId.isValid(req.body.company)) {
      res.status(412).end();
      return;
    }
    async.waterfall([
      function findExperience(callback) {
          var aggregate = User.aggregate();
          aggregate.match({_id: ObjectId(req.user.id)});
          aggregate.project({
            experiences: {$filter: {
                input: '$experiences',
                as: 'item',
                cond: {$eq: ['$$item._id', ObjectId(req.params.experience)]}
            }}
          }).exec(function(err, user) {
            if (err) {
                callback(err, null);
            } else if (!user.length || !user[0].experiences || !user[0].experiences.length) {
                var err = new Error('Experiences Not Found');
                err.status = 404;
                callback(err, null);
            } else {
                callback(null, user[0].experiences[0]);
            }
          });
      },
      function extendExperience(experience, callback) {
          if (req.body.project) {
            experience.project = req.body.project;
          }
          if (req.body.company) {
            experience.company = req.body.company;
          }
          if (req.body.to) {
            experience.to = req.body.to;
          }
          if (req.body.from) {
            experience.from = req.body.from;
          }
          if (req.body.work) {
            experience.work = req.body.work;
          }
          callback(null, experience);
      },
      function findRelateInfo(experience, callback) {
          async.parallel({

            company: function (callback) {
              Company.findById(experience.company, callback);
            },

            project: function (callback) {
              Project.findById(experience.project, callback);
            },

            user: function (callback) {
              User.findById(req.user.id, callback);
            },

            experience: function (callback) {
              callback(null, experience)
            }

          }, callback);
      },
      function updateRelateInfo(relateInfo, callback) {
          async.parallel({

            company: function (callback) {
                // relateInfo.oldcompany.projects.pull(relateInfo.project.id); // TODO
                relateInfo.company.projects.addToSet(relateInfo.project.id);
                relateInfo.company.save(callback);
            },

            project: function (callback) {
                // relateInfo.oldproject.relCompanies.pull(relateInfo.company.id); // TODO
                relateInfo.project.relCompanies.addToSet(relateInfo.company.id);

                var projectCount = 0;
                relateInfo.user.experiences.forEach(function(experience) {
                    if (experience.project + "" == relateInfo.experience.project + "") {
                        projectCount ++;
                    }
                });
                if (projectCount) {
                  relateInfo.project.members.addToSet(req.user.id);
                } else {
                  relateInfo.project.members.pull(req.user.id);
                }
                relateInfo.project.save(callback);
            },

            experience: function (callback) {
                relateInfo.user.experiences.forEach(function(experience) {
                     if(experience._id + "" == relateInfo.experience._id + "") {
                         experience.project = relateInfo.experience.project;
                         experience.company = relateInfo.experience.company;
                         experience.to = relateInfo.experience.to;
                         experience.from = relateInfo.experience.from;
                         experience.work = relateInfo.experience.work;
                     }

                });
                relateInfo.user.save(function(err, user){
                    if (err) callback(err);
                    else callback(null, relateInfo.experience);
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
