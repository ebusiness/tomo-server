angular.module('tripod')
  .controller('ProfileEditController', [
    '$timeout',
    '$location',
    '$mdDialog',
    'VisaValue',
    'CountryValue',
    'LanguageValue',
    'CategoryService',
    'MeService',
    'user',
    function(
      $timeout,
      $location,
      $mdDialog,
      VisaValue,
      CountryValue,
      LanguageValue,
      CategoryService,
      MeService,
      user
    ) {

      var self = this;

      // user model
      self.user = user;

      // country name list
      self.countries = CountryValue;

      self.visaTypes = VisaValue;

      self.category = [];

      // trigger photo file selection
      self.triggerFile = function() {
        $timeout(function() {
          document.getElementById('fileInput').click();
        }, 0);
      }

      // category auto complete
      self.searchCategory = function(name) {
        return CategoryService.query({
          name: name
        });
      };

      // edit language
      self.editLanguage = function($event, language) {

        $mdDialog.show({
          controller: ['$mdDialog', 'language', LanguageController],
          controllerAs: 'ctrl',
          templateUrl: '/template/user/profile/language.html',
          targetEvent: $event,
          locals: {
            language: language || {}
          },
          clickOutsideToClose: true
        }).then(function(language) {

          if (!_.has(language, '_id')) {
            if (!self.user.languages) self.user.languages = [];
            self.user.languages.push(language);
          }

          MeService.save({}, self.user);
        });

        function LanguageController($mdDialog, language) {

          // language name list
          this.languages = LanguageValue;

          this.language = language;

          this.done = function() {
            $mdDialog.hide(this.language);
          };

          this.cancel = function() {
            $mdDialog.cancel();
          };
        }
      };

      // remove language
      self.removeLanguage = function($event, language) {

        var confirm = $mdDialog.confirm()
          .targetEvent($event)
          .title('語学力を削除')
          .content('語学力「' + language.name + '」を削除します、よろしいですか？')
          .cancel('取消')
          .ok('はい');

        $mdDialog.show(confirm).then(function() {
          _.pull(self.user.languages, language);
          MeService.save({}, self.user);
        });
      };

      // edit education
      self.editEducation = function($event, edu) {

        $mdDialog.show({
          controller: ['$mdDialog', 'edu', EducationController],
          controllerAs: 'ctrl',
          templateUrl: '/template/user/profile/education.html',
          targetEvent: $event,
          locals: {
            edu: edu || {}
          },
          clickOutsideToClose: true
        }).then(function(education) {

          if (!_.has(education, '_id')) {
            if (!self.user.educations) self.user.educations = [];
            self.user.educations.push(education);
          }

          MeService.save({}, self.user);
        });

        function EducationController($mdDialog, edu) {

          this.edu = edu;

          this.done = function() {
            $mdDialog.hide(this.edu);
          };

          this.cancel = function() {
            $mdDialog.cancel();
          };
        }

      };

      // remove education
      self.removeEducation = function($event, edu) {

        var confirm = $mdDialog.confirm()
          .targetEvent($event)
          .title('学歴を削除')
          .content('学歴「' + edu.school + '」を削除します、よろしいですか？')
          .cancel('取消')
          .ok('はい');

        $mdDialog.show(confirm).then(function() {
          _.pull(self.user.educations, edu);
          MeService.save({}, self.user);
        });
      };

      // edit career
      self.editCareer = function($event, career) {

        $mdDialog.show({
          controller: ['$mdDialog', 'career', CareerController],
          controllerAs: 'ctrl',
          templateUrl: '/template/user/profile/career.html',
          targetEvent: $event,
          locals: {
            career: career || {}
          },
          clickOutsideToClose: true
        }).then(function(career) {

          if (!_.has(career, '_id')) {
            if (!self.user.careers) self.user.careers = [];
            self.user.careers.push(career);
          }

          MeService.save({}, self.user);
        });

        function CareerController($mdDialog, career) {

          this.career = career;

          this.done = function() {
            $mdDialog.hide(this.career);
          };

          this.cancel = function() {
            $mdDialog.cancel();
          };
        }
      }

      // remove career
      self.removeCareer = function($event, career) {

        var confirm = $mdDialog.confirm()
          .targetEvent($event)
          .title('職歴を削除')
          .content('職歴「' + career.company + '」を削除します、よろしいですか？')
          .cancel('取消')
          .ok('はい');

        $mdDialog.show(confirm).then(function() {
          _.pull(self.user.careers, career);
          MeService.save({}, self.user);
        });
      };

      // profile update
      self.update = function() {
        MeService.save({}, self.user, function() {
          $location.path('/profile');
        });
      };

    }
  ]);
