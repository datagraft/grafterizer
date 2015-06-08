'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:TransformationCtrl
 * @description
 * # TransformationCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('TransformationCtrl', function (
    $scope,
    $stateParams,
    ontotextAPI,
    $rootScope,
    $state,
    $mdToast,
    $mdDialog) {

  	var id = $scope.id = $stateParams.id;
    $scope.document = {
      title: 'loading'
    };

    ontotextAPI.transformation(id).success(function(data){
      console.log(data)
      $scope.document = data;
      $scope.document.title = data['dct:title'];
      $scope.document.description = data['dct:description'];
    }).error(function(data, status){
      $state.go('^');
    });

    ontotextAPI.getClojure(id).success(function(data){
      console.log(data);
      $scope.clojure = data;
    });

    $rootScope.actions = {
      save: function(){
        var update = angular.copy($scope.document);
        update['dct:title'] = update.title;
        update['dct:description'] = update.description;
        delete update.title;
        delete update.description;
        console.log(update);
        console.log(JSON.stringify(update))

        ontotextAPI.updateTransformation(id, update)
          .success(function(data){
            console.log(data);
            console.log("oh yeah");
          });
      },
      delete: function(ev) {
        var confirm = $mdDialog.confirm()
          .title('Do you really want to delete this transformation?')
          .content('It\'s a nice transformation')
          .ariaLabel('Deletion confirmation')
          .ok('Please do it!')
          .cancel('I changed my mind, I like it')
          .targetEvent(ev);

        $mdDialog.show(confirm).then(function() {
          ontotextAPI.deleteTransformation(id).success(function(){
            $state.go('transformations');
            $mdToast.show(
              $mdToast.simple()
                .content('Transformation "'+$scope.document.title+'" deleted')
                .position('bottom left')
                .hideDelay(6000)
            );
          });
        });
      }
    };
  });