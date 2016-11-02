'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:FillDatagraftWizard
 * @description
 * # ComputetriplesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('FillDatagraftWizard', function(
              $scope,
               $rootScope,
               $mdDialog,
               $stateParams,
               PipeService,
               datagraftPostMessage) {

  $scope.processing = false;
  $scope.mapRDF = $scope.showMapRDFButton = $rootScope.transformation.graphs && $rootScope.transformation.graphs.length !== 0;

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.continue = function() {
    var distribution = $stateParams.distributionId;
    var transformation = $stateParams.id;

    var upwizardExtractIDRegex = /^upwizards--(\d+)$/;
    var matchUpwizardId = distribution.match(upwizardExtractIDRegex);
    if (!matchUpwizardId) {
      $mdDialog.cancel();
      $mdDialog.show(
        $mdDialog.alert({
          title: 'Oops',
          content: 'You must have a upwizard file to perform this operation.',
          ok: 'Sure'
        })
      );
      return;
    }
    $scope.processing = true;
    PipeService.fillWizard($stateParams.distributionId, $stateParams.id, matchUpwizardId[1],
                           $scope.mapRDF ? 'graft' : 'pipe').success(function() {
      var isIframe = window !== window.top;

      if (!isIframe) {
        $mdDialog.show(
          $mdDialog.alert({
            title: 'It worked',
            content: 'The data has been correctly processed and the next wizard step is ready to be used.<br/>However, you must manually visit the next step, because Grafterizer is being used outside of DataGraft.',
            ok: 'Sure'
          })
        );
      } else {
        var location = $scope.mapRDF ? '/myassets/upwizards/fill_sparql_endpoint/' : '/myassets/upwizards/fill_filestore/';
        location += matchUpwizardId[1];
        datagraftPostMessage.setLocation(location);
        $mdDialog.cancel();
      }
    }).error(function() {
      $scope.processing = false;
    });
  };
});

