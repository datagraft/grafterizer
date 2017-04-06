'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:fillRowsFunction
 * @description
 * # fillRowsFunction
 */
angular.module('grafterizerApp')
  .directive('fillRowsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/fillRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          
          
        if (!scope.function) {
            
         
          scope.function = new transformationDataModel.FillRowsFunction(null, null);
          scope.function.docstring = null;
        }
        
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
             
          return new transformationDataModel.FillRowsFunction(
            scope.function.indexFrom,
              scope.function.indexTo,
            scope.function.docstring);
        };

            
           
       
       
      }
    };
  });
