'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:addProperty
 * @description
 * # addProperty
 */
angular.module('grafterizerApp')
  .directive('addProperty', function($mdDialog) {
    return {
      templateUrl: 'views/addproperty.html',
      restrict: 'E',
      scope: {
        property: '=',
        parent: '='
      },
      link: function postLink(scope, element, attrs) {
        scope.addPropertyAfter = function(property) {
          var newScope = scope.$new(false, scope);
          newScope.property = null;
          newScope.isCreateNew = true;
          $mdDialog.show({
            templateUrl: 'views/propertydialog.html',
            controller: 'PropertydialogCtrl',
            scope: newScope,
            clickOutsideToClose: true
          }).then(function(propertyNode) {
              
              
              if (scope.parent.subElements[0].isNested)
                scope.parent.addNodeAfter(property, propertyNode, true);
              else
                scope.parent.addNodeAfter(property, propertyNode, false);
          });
        };
      }
    };
  });
