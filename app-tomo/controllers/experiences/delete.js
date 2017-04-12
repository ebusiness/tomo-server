var async = require('async'),
    Push = require('../../utils/push'),
    mongoose = require('mongoose'),
    ObjectId = mongoose.Types.ObjectId;

module.exports = function(User, Project, Company) {

  return function(req, res, next) {
    if(!req.params.experience || !ObjectId.isValid(req.params.experience)) {
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
            // TODO
            // company: function (callback) {
            //     relateInfo.oldcompany.projects.pull(relateInfo.project.id);
            //     relateInfo.company.save(callback);
            // },

            project: function (callback) {
                // relateInfo.oldproject.relCompanies.pull(relateInfo.company.id); // TODO
                var projectCount = 0;
                relateInfo.user.experiences.forEach(function(experience) {
                    if (experience._id + "" == relateInfo.experience._id + "") {
                        return;
                    }
                    if (experience.project + "" == relateInfo.experience.project + "") {
                        projectCount ++;
                    }
                });
                if (projectCount) {
                  callback(null, relateInfo.project);
                  return;
                }
                relateInfo.project.members.pull(req.user.id);
                relateInfo.project.save(callback);
            },

            experience: function (callback) {
                relateInfo.user.experiences.forEach(function(experience, index) {
                     if(experience._id + "" == relateInfo.experience._id + "") {
                        relateInfo.user.experiences.pull(experience);
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
        res.json({});
      }
    });
  };
};
