'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:PreviewCtrl
 * @description
 * # PreviewCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
.controller('PreviewCtrl', function(
            $scope,
            PipeService,
            $timeout,
            $rootScope,
            $stateParams,
            generateClojure,
            $mdToast,
            $mdDialog,
            transformationDataModel,
            datagraftPostMessage) {
  

  $scope.developmentMode = !!window.location.port;     
  var paginationSize = 100;

  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $scope.pathBack = toParams.path_back;
    if(toParams.distributionId){
      $scope.$parent.showPreview = true;
      $rootScope.previewmode = true;
    } else {
      $scope.$parent.showPreview = false;
      $rootScope.previewmode = false;
    }
  });
  
  $scope.livePreview = !(window.sessionStorage && window.sessionStorage.livePreview === 'false');
  $scope.selectedTabIndex = 0;

  $scope.$on('$destroy', function() {
    if ($rootScope.currentlyPreviewedFunction) {
      $rootScope.currentlyPreviewedFunction.isPreviewed = false;
      $rootScope.currentlyPreviewedFunction = {};
    }
  });

  $scope.selectedDistribution = $stateParams.distributionId;

  $scope.totalNumberOfCalls = 0;
  var savedGeneratedClojure;
  var currentPreviewPage = 0;
  var previewTransformation = function() {
//    var clojure = generateClojure.fromTransformation($scope.$parent.transformation);
    // TODO not sure this works properly - need to clarify the way the throttle passes arguments
    
    var clojure = $rootScope.previewedClojure ? $rootScope.previewedClojure : generateClojure.fromTransformation($scope.$parent.transformation);
    $scope.totalNumberOfCalls++;
    savedGeneratedClojure = clojure;
    currentPreviewPage = 0;

    if (!clojure) return;

    PipeService.preview($scope.selectedDistribution, clojure, 0, paginationSize)
      .then(function(data) {
      delete $scope.graftwerkException;
      $scope.data = data;
    },

    function(data) {
      if (data) {
        if (data.edn && data.edn[':message']) {
          $scope.graftwerkException = data.edn[':message'];
        } else if (data.json && data.json.error) {
          $scope.graftwerkException = data.json.error;
        } else {
          $scope.graftwerkException = data.raw;
        }

        if ($scope.graftwerkException.match(/(out of memory|timed out)/i)) {
          $mdDialog.show(
            $mdDialog.alert()
              .title($scope.graftwerkException)
              .content('The provided input file could not be transformed with the specified transformation due to an exceeded processing quota. We are aware of the limitation and will be extending the quotas in the near future.')
              .ok('Ok')
          );
        }

        // Delete the outdated data
        $scope.data = null;

        $timeout(function() {
          $scope.selectedTabIndex = 0;
        });
      } else {
        delete $scope.graftwerkException;
        $mdToast.show(
          $mdToast.simple()
          .content('Unable to load the transformation')
          .position('bottom left')
          .hideDelay(6000)
        );
      }
    });
  };

  var throttlePreview = _.debounce(function() {
    if ($scope.selectedDistribution) {
      previewTransformation();
    }
  }, 1000, {leading: false});

  if (window.sessionStorage) {
    $scope.$watch('livePreview', function() {
      window.sessionStorage.livePreview = $scope.livePreview ? 'true' : 'false';
    });
  }


  $scope.$watch('livePreview', function(newValue, oldValue) {
    if (newValue === true && oldValue === false) {
      previewTransformation(false);
    }
  });

  var fileSaved = false;
  $scope.$watch('transformation', function() {
    if ($scope.livePreview && $rootScope.transformation) {
      if ($rootScope.currentlyPreviewedFunction) {
        var partialTransformation = $rootScope.transformation.getPartialTransformation($rootScope.currentlyPreviewedFunction);
        $rootScope.previewedClojure = generateClojure.fromTransformation(partialTransformation);
      } else {
        $rootScope.previewedClojure = generateClojure.fromTransformation($rootScope.transformation);
        // we probably deleted the previewed function - preview whole transformation
      }
      throttlePreview(false);
      fileSaved = false;
    }
  }, true);

  $scope.$on('preview-request', function() {
    throttlePreview(false);
    fileSaved = true;
  });

  $scope.$watch('selectedDistribution', function() {
    if ($scope.selectedDistribution) {
      delete $scope.originalData;
      delete $scope.data;
      throttlePreview(true);
    }
  });

  var currentOriginalPage = 0;
  /*$scope.loadOriginalData = function() {
    if ($scope.originalData) return;

    if ($scope.selectedDistribution) {
      PipeService.original($scope.selectedDistribution, 0, paginationSize)
        .then(function(data) {
        $scope.originalData = data;
      });
    }
  };
    */
        $scope.loadOriginalData = function () {
            var uploadDatasetFunction = _.get($scope.$parent.transformation, 'pipelines[0].functions[0]'); // original data is created out of read-dataset
          if (!uploadDatasetFunction) return;
          var clojure = '(def make-graph (graph-fn [{:keys []}])) (defpipe my-pipe [data-file] (-> ' + uploadDatasetFunction.generateClojure().ednEncode() + '))';
          if ($scope.selectedDistribution) {
            PipeService.preview($scope.selectedDistribution, clojure, 0, paginationSize)
              .then(function (data) {
                $scope.originalData = data;
              });
          }
        };

 /* $scope.loadMorePreview = function(callback) {
    if (!savedGeneratedClojure) return;
    PipeService.preview($scope.selectedDistribution,
                        savedGeneratedClojure,
                        ++currentPreviewPage, paginationSize)
      .then(function(data) {
      if ($scope.data && $scope.data.edn && data && data.edn) {
        callback(undefined, data.edn);
      } else {
        callback(true);
      }
    },

    function() {
      callback(true);
    });
  };*/
     $scope.loadMorePreview = function (callback) {
            if (!savedGeneratedClojure) return;
            PipeService.preview($scope.selectedDistribution
                    , savedGeneratedClojure
                    , ++currentPreviewPage, paginationSize)
                .then(function (data) {
                        if ($scope.data && $scope.data.edn && data && data.edn) {
                            callback(undefined, data.edn);
                        } else {
                            callback(true);
                        }
                    },

                    function () {
                        callback(true);
                    });
        };
    
 /* $scope.loadMoreOriginal = function(callback) {
    if ($scope.selectedDistribution) {
      PipeService.original($scope.selectedDistribution, ++currentOriginalPage, paginationSize)
        .then(function(data) {
        if (data && data.edn) {
          callback(undefined, data.edn);
        } else {
          callback(true);
        }
      },

      function() {
        callback(true);
      });
    }
  };*/
            $scope.loadMoreOriginal = function (callback) {
          if ($scope.selectedDistribution) {
            var uploadDatasetFunction = _.get($scope.$parent.transformation, 'pipelines[0].functions[0]'); // original data is created out of read-dataset
            if (!uploadDatasetFunction) return;
            var clojure = '(def make-graph (graph-fn [{:keys []}])) (defpipe my-pipe [data-file] (-> ' + uploadDatasetFunction.generateClojure().ednEncode() + '))';
            PipeService.preview($scope.selectedDistribution, clojure, ++currentOriginalPage, paginationSize)
              .then(function (data) {
                  if (data && data.edn) {
                    callback(undefined, data.edn);
                  } else {
                    callback(true);
                  }
                },
                function () {
                  callback(true);
                });
          }
        };


  // If it's an upwizards distribution, it means grafterizer is used
  // inside the Datagraft widget, and therefore, should provide the next step
  // mechanism
  var upwizardExtractIDRegex = /^upwizards--(\d+)$/;
  var matchUpwizardId = $scope.selectedDistribution.match(upwizardExtractIDRegex);

  if (matchUpwizardId) {
    $rootScope.hideToolbar = true;
    $rootScope.upwizardMode = true;

    $scope.nextWizardStep = function(){
      if ($rootScope.actions && $rootScope.actions.save) {
        // Save but without a preview
        $rootScope.actions.save(true);
      }

      $mdDialog.show({
        templateUrl: 'views/filldatagraftwizard.html',
        controller: 'FillDatagraftWizard',
        scope: $scope.$new(false),
        clickOutsideToClose: true
      });
    };
    
    $scope.previousWizardStep = function() {
      datagraftPostMessage.setLocation($scope.pathBack);
    };
    
    $scope.download = function() {
      $rootScope.actions.download();
    };
    $scope.save = function() {
      $rootScope.actions.save();
    };
  }


    });
