app.directive('uploader', function() {
  return {
    template: "Upload Files <input type='file' name='file' class='file_upload_btn' style='display:none'>",
    link: function(scope, element, attrs) {
      element.bind("click", function() {
        element.find("input")[0].click();
      });
    }
  }
});