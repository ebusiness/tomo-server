angular.module('tripod')
  .controller('PhotoEditController', ['$mdDialog', 'FileUploader', 'SessionService', function($mdDialog, FileUploader, SessionService) {

    var self = this;

    SessionService.user.then(function(user) {
      self.user = user;
    });

    self.uploader = new FileUploader({
      method: 'POST',
      url: '/me/photo',
    });

    self.uploader.onAfterAddingFile = function(item) {

      var reader = new FileReader();
      reader.readAsDataURL(item._file);

      reader.onload = function(event) {

        $mdDialog.show({
          controller: ['$mdDialog', 'originalImg', CropController],
          controllerAs: 'ctrl',
          templateUrl: '/template/user/profile/crop.html',
          locals: {
            originalImg: event.target.result
          },
          clickOutsideToClose: true
        }).then(function(croppedImg) {

          var blob = dataURItoBlob(croppedImg);
          item._file = blob;
          self.uploader.uploadAll();
        });

        function CropController($mdDialog, originalImg) {

          this.originalImg = originalImg;
          this.croppedImg = '';

          this.select = function() {
            $mdDialog.hide(this.croppedImg);
          };
        };

      };
    };

    self.uploader.onSuccessItem = function(item, response, status, headers) {
      self.user.photo = response.photo;
    };

    /**
     * Converts data uri to Blob. Necessary for uploading.
     * @see
     *   http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
     * @param  {String} dataURI
     * @return {Blob}
     */
    var dataURItoBlob = function(dataURI) {
      var binary = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      var array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      return new Blob([new Uint8Array(array)], {
        type: mimeString
      });
    };

  }]);