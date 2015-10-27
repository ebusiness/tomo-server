// Upload Photo
var fs = require('fs'),
  AWS = require('aws-sdk'),
  s3 = new AWS.S3({apiVersion: '2006-03-01'}),
  path = require('path'),
  async = require('async'),
  formidable = require('formidable');

module.exports = function(Group) {

  return function(req, res, next) {

    var imgDir = config.root + '/tmp/cover/',
      uploadForm = new formidable.IncomingForm({
        uploadDir: path.join(imgDir),
        keepExtensions: true
      });

    uploadForm.parse(req, function(err, fields, files) {

      // handle cover file
      if (files.file) {

        var coverType = files.file.type;
        var coverPath = files.file.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(coverType) === -1) {
          res.status(415).end();
          return;
        }

        var coverName = /.*[\/|\\](.*)$/.exec(coverPath)[1];

        async.waterfall([

          function updateGroup(callback) {
            Group.findByIdAndUpdate(req.params.group, {cover: coverName}, {new: true}, callback);
          },

          function uploadCover(group, result, callback) {

            console.log(arguments)

            var tempPath = path.join(config.root, '/tmp/cover/', coverName);

            s3.putObject({
              ACL: 'public-read',
              Key: 'groups/' + group.id + '/cover.png',
              Bucket: config.s3.bucket,
              Body: fs.createReadStream(tempPath),
              ContentType: coverType
            }, function(err, result) {
              if (err) callback(err);
              else callback(null, group, result);
            });
          }

        ], function(err, group, uploadResult) {
          if (err) next(err);
          else res.json(group);
        });

      } else res.status.end();

    });
  };

};
