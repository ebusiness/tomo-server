// Upload Photo
var fs = require('fs'),
  path = require('path'),
  async = require('async'),
  formidable = require('formidable');

module.exports = function(User) {

  return function(req, res, next) {

    var imgDir = config.root + '/public/avatar/',
      uploadForm = new formidable.IncomingForm({
        uploadDir: path.join(imgDir),
        keepExtensions: true
      });

    uploadForm.parse(req, function(err, fields, files) {

      // handle photo file
      if (files.file) {

        var photoType = files.file.type;
        var photoPath = files.file.path;

        if (['image/jpeg', 'image/gif', 'image/png'].indexOf(photoType) === -1) {
          res.status(415).end();
          return;
        }

        var photoName = /.*[\/|\\](.*)$/.exec(photoPath)[1];

        async.parallel({

          deleteCurrentPhoto: function(callback) {

            if (req.user.photo)
              fs.exists(imgDir + req.user.photo, function(exists) {

                if (exists)
                  fs.unlink(imgDir + req.user.photo, function(err) {
                    if (err) callback(err);
                    else callback(null);
                  });
                else callback(null);
              })
            else callback(null);
          },

          updateUser: function(callback) {

            User.findByIdAndUpdate(req.user.id, {
              photo: photoName
            }, {
              new: true
            }, callback);
          }

        }, function(err, results) {
          if (err) next(err);
          else res.json(results.updateUser);
        });

      } else res.status.end();

    });
  };

};