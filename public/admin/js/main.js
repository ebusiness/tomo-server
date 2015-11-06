angular.module('tomo', ['ui.router', 'ngResource', 'ngMessages', 'ngAnimate', 'ngMaterial', 'http-auth-interceptor', 'infinite-scroll', 'angularFileUpload', 'tripod'])
  .config(['$stateProvider', '$urlRouterProvider', '$mdIconProvider', '$mdThemingProvider', function($stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/admin/template/home.html',
        controller: 'HomeController as ctrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: '/admin/template/login.html',
        controller: 'LoginController as ctrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: '/admin/template/signup.html',
        controller: 'SignUpController as ctrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '/admin/template/profile/show.html',
        controller: 'ProfileController as ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })
      .state('profile.edit', {
        url: '/profile-edit',
        templateUrl: '/admin/template/profile/edit.html',
        controller: 'ProfileEditController as ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })

      //////////////////////////////////////////////////
      /// Report Relate
      //////////////////////////////////////////////////
      .state('reports', {
        abstract: true,
        url: '/reports',
        template: '<ui-view layout="column" flex />'
      })
      .state('reports.users', {
        url: '/users',
        templateUrl: '/admin/template/report/user.html',
        controller: 'ReportedUserListController as ctrl'
      })
      .state('reports.posts', {
        url: '/posts',
        templateUrl: '/admin/template/report/post.html',
        controller: 'ReportedPostListController as ctrl'
      })

      //////////////////////////////////////////////////
      /// User Relate
      //////////////////////////////////////////////////
      .state('users', {
        url: '/users',
        templateUrl: '/admin/template/user/index.html',
        controller: 'UserListController as ctrl'
      })
      .state('user', {
        url: '/users/:id',
        templateUrl: '/admin/template/user/show.html',
        controller: 'UserController as ctrl',
        resolve: {
          user: ['$stateParams', 'UserService', function($stateParams, UserService) {
            return UserService.get({
              id: $stateParams.id
            }).$promise;
          }]
        }
      })
      .state('user.profile', {
        url: '/profile',
        templateUrl: '/admin/template/user/show.profile.html',
        controller: 'UserProfileController as fctrl'
      })
      .state('user.posts', {
        url: '/posts',
        templateUrl: '/admin/template/user/show.posts.html',
        controller: 'UserPostController as pctrl'
      })
      .state('user.statistics', {
        url: '/statistics',
        templateUrl: '/admin/template/user/show.statistics.html',
        controller: 'UserStatisticsController as spctrl'
      })

      //////////////////////////////////////////////////
      /// Group Relate
      //////////////////////////////////////////////////
      .state('groups', {
        url: '/groups',
        templateUrl: '/admin/template/group/index.html',
        controller: 'GroupListController as ctrl'
      })
      .state('group', {
        url: '/groups/:id',
        templateUrl: '/admin/template/group/show.html',
        controller: 'GroupController as ctrl',
        resolve: {
          group: ['$stateParams', 'GroupService', function($stateParams, GroupService) {
            return GroupService.get({
              id: $stateParams.id
            }).$promise;
          }]
        }
      })
      .state('group.members', {
        url: '/members',
        templateUrl: '/admin/template/group/show.members.html',
        controller: 'GroupMemberController as mctrl'
      })
      .state('group.posts', {
        url: '/posts',
        templateUrl: '/admin/template/group/show.posts.html',
        controller: 'GroupPostController as pctrl'
      })

      //////////////////////////////////////////////////
      /// Post Relate
      //////////////////////////////////////////////////
      .state('posts', {
        url: '/posts',
        templateUrl: '/admin/template/post/index.html',
        controller: 'PostListController as ctrl'
      })
      .state('post', {
        url: '/posts/:id',
        templateUrl: '/admin/template/post/show.html',
        controller: 'PostController as ctrl',
        resolve: {
          post: ['$stateParams', 'PostService', function($stateParams, PostService) {
            return PostService.get({
              id: $stateParams.id
            }).$promise;
          }]
        }
      });

    $mdIconProvider
      .iconSet('action', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg')
      .iconSet('content', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg')
      .iconSet('editor', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg')
      .iconSet('navigation', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg')
      .iconSet('maps', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg')
      .iconSet('communication', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg')
      .iconSet('social', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg');

    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('pink');

  }]);

// .run(['$http', '$templateCache', function($http, $templateCache) {
//   $http.get('/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', {
//     cache: $templateCache
//   });
// }]);

// bootstrap application manually
angular.bootstrap(document, ['tomo']);
