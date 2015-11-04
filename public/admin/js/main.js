angular.module('tomo', ['ngRoute', 'ngResource', 'ngMessages', 'ngAnimate', 'ngMaterial', 'http-auth-interceptor', 'infinite-scroll', 'angularFileUpload', 'tripod'])
  .config(['$routeProvider', '$mdIconProvider', '$mdThemingProvider', function($routeProvider, $mdIconProvider, $mdThemingProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/admin/template/home.html',
        controller: 'HomeController',
        controllerAs: 'ctrl'
      })
      .when('/login', {
        templateUrl: '/admin/template/login.html',
        controller: 'LoginController',
        controllerAs: 'ctrl'
      })
      .when('/signup', {
        templateUrl: '/admin/template/signup.html',
        controller: 'SignUpController',
        controllerAs: 'ctrl'
      })
      .when('/profile', {
        templateUrl: '/admin/template/profile/show.html',
        controller: 'ProfileController',
        controllerAs: 'ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })
      .when('/profile-edit', {
        templateUrl: '/admin/template/profile/edit.html',
        controller: 'ProfileEditController',
        controllerAs: 'ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })
      .when('/users', {
        templateUrl: '/admin/template/user/index.html',
        controller: 'UserListController',
        controllerAs: 'ctrl'
      })
      .when('/users/:id', {
        templateUrl: '/admin/template/user/show.html',
        controller: 'UserController',
        controllerAs: 'ctrl',
        resolve: {
          user: ['$route', 'UserService', function($route, UserService) {
            return UserService.get({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .when('/groups', {
        templateUrl: '/admin/template/group/index.html',
        controller: 'GroupListController',
        controllerAs: 'ctrl'
      })
      .when('/groups/:id', {
        templateUrl: '/admin/template/group/show.html',
        controller: 'GroupController',
        controllerAs: 'ctrl',
        resolve: {
          group: ['$route', 'GroupService', function($route, GroupService) {
            return GroupService.get({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .when('/posts', {
        templateUrl: '/admin/template/post/index.html',
        controller: 'PostListController',
        controllerAs: 'ctrl'
      })
      .when('/posts/:id', {
        templateUrl: '/admin/template/post/show.html',
        controller: 'PostController',
        controllerAs: 'ctrl',
        resolve: {
          post: ['$route', 'PostService', function($route, PostService) {
            return PostService.get({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
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
