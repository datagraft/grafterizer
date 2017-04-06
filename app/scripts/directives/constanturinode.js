'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:constantURINode
 * @description
 * # constantURINode
 */
angular.module('grafterizerApp')
  .directive('constantUriNode', function(
             $mdDialog,
              transformationDataModel,
              RecursionHelper,$rootScope) {
  return {
    templateUrl: 'views/constanturinode.html',
    restrict: 'E',
    scope: {
      node: '=',
      parent: '='
    },
    compile: function(element) {
      return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
        scope.editNode = function() {
          scope.originalNode = {};
          scope.nodeCurrentState = {};
          angular.copy(scope.node, scope.originalNode);
          angular.copy(scope.node, scope.nodeCurrentState);
          var newScope = scope.$new(false, scope);
          newScope.nodeCurrentState = scope.nodeCurrentState;
          newScope.parentNode = scope.parent;
          newScope.isCreate = false;
          $mdDialog.show({
            templateUrl: 'views/mappingnodedefinitiondialog.html',
            controller: 'MappingnodedefinitiondialogCtrl',
            scope: newScope,
            clickOutsideToClose: true
          }).then(
            function(graphNode) {
              scope.parent.replaceChild(scope.node, graphNode);
            },
            function() {
              newScope.$destroy();
            });
        };

        scope.clickRemoveNode = function(node) {
          $mdDialog.show(
            $mdDialog.confirm()
            .title(
              'Are you sure you want to remove this element?')
            .content(
              'Please confirm that you want to remove the element.'
            )
            .ariaLabel(
              'Please confirm that you want to remove the element.'
            )
            .ok('Yes')
            .cancel('Cancel')).then(function() {
            scope.parent.removeChild(node);
          });
        };

        scope.clickAddNodeAfter = function() {
          var newScope = scope.$new(false, scope);
          newScope.isCreate = true;
          newScope.parentNode = scope.parent;
          $mdDialog.show({
            templateUrl: 'views/mappingnodedefinitiondialog.html',
            controller: 'MappingnodedefinitiondialogCtrl',
            scope: newScope,
            clickOutsideToClose: true
          }).then(function(graphNode) {
            if (graphNode) {
                
                
              scope.parent.addNodeAfter(scope.node, graphNode);
                
                
            }
          }, function() {

            newScope.$destroy();
          });
        };

        scope.clickAddChildProperty = function() {
          scope.originalProperties = [];
          angular.copy(scope.node.subElements, scope.originalProperties);
          var newScope = scope.$new(false, scope);
          newScope.isCreateNew = true;
          $mdDialog.show({
            templateUrl: 'views/propertydialog.html',
            controller: 'PropertydialogCtrl',
            scope: newScope,
            clickOutsideToClose: true
          }).then(
            function(propertyNode) {
              if (propertyNode) {
                  console.log(scope.node);
                  console.log(scope.parent);
                if (scope.parent.__type=== 'Graph') {
                scope.node.addNodeAfter(null, propertyNode);
              }
                  else 
                 scope.node.addNodeAfter(null, propertyNode,true);
            
              }
            },

            function() {
              angular.copy(scope.originalProperties, scope.node.subElements);
            });
        };
      });
    }
  };
});
