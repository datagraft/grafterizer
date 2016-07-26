'use strict';

/**
 * @ngdoc overview
 * @name grafterizerApp
 * @description
 * # Grafterizer
 *
 * This file contains the declaration of the application dependencies,
 * and the modules settings.
 *
 * The theme is defined here, as well as the routing (using a state machine).
 */
angular
  .module('grafterizerApp', [
    'ui.router',
    'ngMaterial',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngFileUpload',
    'ui.grid',
    'ui.grid.autoResize',
    'angular-loading-bar',
    'ncy-angular-breadcrumb',
    'angularMoment',
    'as.sortable',
    'ui.codemirror',
    'ui.grid.selection',
    'ui.grid.edit',
    'ui.grid.resizeColumns',
    'ui.grid.exporter',
    'ui.grid.infiniteScroll',
    'ngMessages',
    'RecursionHelper',
    'vAccordion',
    'oi.select'
])
  .config(function(
    backendServiceProvider,
    PipeServiceProvider,
    jarfterServiceProvider,
    $mdThemingProvider,
    $stateProvider,
    $urlRouterProvider,
    $urlMatcherFactoryProvider,
    cfpLoadingBarProvider,
    $breadcrumbProvider,
    $locationProvider,
    $provide,
    $httpProvider) {

    var developmentMode = !!window.location.port;

    if (typeof Raven !== 'undefined') {

      var sentryPath = developmentMode ?
        'http://76c7f69b67a649619dbf7a9f679efb96@sentry.datagraft.net/6'
        : 'https://cdec3ae0110344cabdd5a242d2247d07@grafterizer.datagraft.net/5';

      Raven.config(sentryPath, {}).install();

      $provide.decorator('$exceptionHandler', ['$delegate', function($delegate) {
        return function(exception, cause) {
          $delegate(exception, cause);
          if (typeof Raven !== 'undefined') {
            Raven.captureException(exception, { cause: cause });
          }
        };
      }]);

    } else {
      window.Raven = {
        captureEvents: console.log,
        captureMessage: console.log
      };
    }

    if (developmentMode) {
      var path = location.protocol + '//' + location.hostname;
      jarfterServiceProvider.setEndpoint(path + ':8081');
      backendServiceProvider.setEndpoint(path + ':8082');
      PipeServiceProvider.setEndpoints(path + ':8082', path + ':8083');
    } else {
      PipeServiceProvider.setEndpoints('/backend', '/cache');
      jarfterServiceProvider.setEndpoint('');
      backendServiceProvider.setEndpoint('/backend');
    }

    $urlRouterProvider.otherwise('/transformations');

    sessionStorage.localClassAndProperty = JSON.stringify([]);
    sessionStorage.localVocabulary = JSON.stringify([]);

    if (!window.navigator.device && !developmentMode) {
      $locationProvider.html5Mode(true);
    }

    // Workaround for https://github.com/angular-ui/ui-router/issues/1119
    var valToString = function(val) {
      return val !== null ? val.toString() : val;
    };

    $urlMatcherFactoryProvider.type('nonURIEncoded', {
      encode: valToString,
      decode: valToString,
      is: function() {
        return true;
      }
    });

    $urlMatcherFactoryProvider.type('previewURI', {
      encode: function(val) {
        return window.btoa(val);
      },

      decode: function(val) {
        return window.atob(val);
      },

      is: function() {
        return true;
      }
    });

    $stateProvider
      .state('about', {
        url: '/about',
        views: {
          main: {
            templateUrl: 'views/about.html'
          }
        },
        ncyBreadcrumb: {
          label: 'About'
        }
      })
      .state('transformations', {
        url: '/transformations?showPublic&search',
        views: {
          main: {
            templateUrl: 'views/transformations.html',
            controller: 'TransformationsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Data transformations'
        }
      })
      .state('transformations.new', {
        url: '/new',
        views: {
          'main@': {
            controller: 'TransformationNewCtrl',
            templateUrl: 'views/transformation.html'
          },
          'actions@': {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "New transformation"}}'
        }
      })
      .state('transformations.transformation', {
        url: '/:publisher/:id',
        views: {
          'main@': {
            templateUrl: 'views/transformation.html',
            controller: 'TransformationCtrl'
          },
          'actions@': {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File " + title}}'
        }
      })
      .state('transformations.transformation.preview', {
        url: '/preview/:distributionId',
        views: {
          preview: {
            templateUrl: 'views/preview.html',
            controller: 'PreviewCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{(selectedDistribution || "No dataset loaded")|beautifyUri}}'
        }
      })
      .state('transformations.readonly', {
        url: '/readonly/:publisher/:id',
        params: {
          showToolbar: null,
        },
        views: {
          'main@': {
            templateUrl: 'views/readonly.html',
            controller: 'ReadOnlyCtrl'
          },
          'actions@': {
            templateUrl: 'views/actions.html',
            controller: 'ActionsCtrl'
          }
        },
        ncyBreadcrumb: {
          label: '{{document.title || "File "+id}}'
        }
      })
      .state('help', {
        url: '/help',
        views: {
          main: {
            templateUrl: 'views/help.html',
            controller: 'HelpCtrl'
          }
        },
        ncyBreadcrumb: {
          label: 'Help'
        }
      });

    // The spinner is a bit too much
    cfpLoadingBarProvider.includeSpinner = false;

    // Breadcrumb settings using material-style
    $breadcrumbProvider.setOptions({
      template: '<ol class="breadcrumb">' +
        '<li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">' +
        '<a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>' +
        '<span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>' +
        '</li>' +
        '</ol>'
    });

    // Theme settings

    $mdThemingProvider.definePalette('customPrimary', {
      50: '#a9b2d7',
      100: '#97a2cf',
      200: '#8693c6',
      300: '#7583be',
      400: '#6374b6',
      500: '#5264AE',
      600: '#495a9d',
      700: '#41508c',
      800: '#39467a',
      900: '#313c69',
      A100: '#bac1df',
      A200: '#ccd1e7',
      A400: '#dde0ef',
      A700: '#293258',
      contrastDefaultColor: 'light'
    });

    $mdThemingProvider.definePalette('customAccent', {
      50: '#333333',
      100: '#333333',
      200: '#333333',
      300: '#f7fcfc',
      400: '#e4f4f5',
      500: '#EEEEEE',
      600: '#bfe6e7',
      700: '#addee0',
      800: '#9ad7d9',
      900: '#88cfd2',
      A100: '#EEEEEE',
      A200: '#EEEEEE',
      A400: '#EEEEEE',
      A700: '#75c8cb',
      contrastDefaultColor: 'dark'
    });

    $mdThemingProvider.definePalette('dapaasPrimary', {
      50: '#67ffa0',
      100: '#4eff90',
      200: '#34ff80',
      300: '#1bff70',
      400: '#01ff60',
      500: '#00E756',
      600: '#00cd4c',
      700: '#00b443',
      800: '#009a3a',
      900: '#008130',
      A100: '#81ffb0',
      A200: '#9affc0',
      A400: '#b4ffd0',
      A700: '#006727',
      contrastDefaultColor: 'dark'
    });

    $mdThemingProvider.theme('default')
      .primaryPalette('customPrimary')
      .accentPalette('blue');

    // .primaryPalette('dapaasPrimary')
    // .accentPalette('customAccent');

    // JSEDN is too restrictive by default on valid symbols
    jsedn.Symbol.prototype.validRegex = new RegExp(/[\s\S]*/);

    // Enable credentials with the API communication
    $httpProvider.defaults.withCredentials = true;
  }).run(function(datagraftPostMessage, $state, $rootScope) {
    datagraftPostMessage.setup();

    // Mobile detection (as Leaflet 1.0 does)
    var ua = navigator.userAgent.toLowerCase();
    $rootScope.isMobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1;
  });
