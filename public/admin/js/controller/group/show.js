angular.module('tripod')
  .controller('GroupController', [
    'SessionService',
    'GroupService',
    'group',
    function (
      SessionService,
      GroupService,
      group
    ) {

    var self = this;
    self.group = group;

    self.uploader = new FileUploader({
      method: 'POST',
      url: '/me/photo',
    });

  }]);
