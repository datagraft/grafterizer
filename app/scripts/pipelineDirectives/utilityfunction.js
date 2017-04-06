'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:utilityFunction
 * @description
 * # utilityFunction
 */
angular.module('grafterizerApp')
  .directive('utilityFunction', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/utilityFunction.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
          
          
        if (!scope.function) {
             var utilFunct = new transformationDataModel.FunctionWithArgs(null,[]);
         
          scope.function = new transformationDataModel.UtilityFunction(utilFunct, null);
          scope.function.docstring = null;
        }
        if (scope.function.functionName) console.log(scope.function.functionName.getParams());
        scope.$parent.generateCurrFunction = function() {
          // TODO fix selected function bug
             if (scope.function.functionName) console.log(scope.function.functionName.getParams());
          var   func = scope.$parent.transformation.findPrefixerOrCustomFunctionByName(scope.function.functionName);
          return new transformationDataModel.UtilityFunction(
            func,
            scope.function.docstring);
        };

            scope.getCustomFunctions = function() {

        var customFunctions = [];
        for (var i = 0; i < scope.$parent.transformation.customFunctionDeclarations.length; ++i) {
            if (scope.$parent.transformation.customFunctionDeclarations[i].group == 'UTILITY')
          customFunctions.push({
            name: scope.$parent.transformation.customFunctionDeclarations[i].name,
            clojureCode: scope.$parent.transformation.customFunctionDeclarations[i].clojureCode,
            group: scope.$parent.transformation.customFunctionDeclarations[i].group,
            id: i});
        }
    
        
        return customFunctions;
      };
           
       scope.$watch('function.functionName', function(value) {
          if (value) console.log(value);
       });    
       
      }
    };
  });
