'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:fillRowsFunction
 * @description
 * # fillRowsFunction
 */
angular.module('grafterizerApp')
  .directive('mergeRowsFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/mergeRowsFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          
          
        if (!scope.function) {
            
         
          scope.function = new transformationDataModel.MergeRowsFunction(null, null,null,'');
          scope.function.docstring = null;
        }
        
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
             
          return new transformationDataModel.MergeRowsFunction(
            scope.function.indexFrom,
              scope.function.indexTo,
              scope.function.separator,
            scope.function.docstring);
        };

            
           
       
       
      }
    };
  });
