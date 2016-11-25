'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:uploadDataset
 * @description
 * # uploadDataset
 */
angular.module('grafterizerApp')
  .directive('uploadDataset', function(transformationDataModel) {
    return {
      templateUrl: 'views/pipelineFunctions/uploadDataset.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.$parent.generateCurrFunction = function() {
          return new transformationDataModel.UploadDatasetFunction(
            scope.selectedType,
            scope.typeList,
            scope.delimiter,
            scope.sheetNames,
            scope.selectedSheet,
            scope.extension,
            scope.function.docstring);
        };

        if (!scope.function) {
          scope.function = new transformationDataModel.UploadDatasetFunction(null,[],null, [],null, null, null);
          scope.function.docstring = null;
        }
        if (!(scope.function instanceof transformationDataModel.UploadDatasetFunction)) {
          var newFunction = new transformationDataModel.UploadDatasetFunction(null,[],null, [],null, null, null);
          _.extend(newFunction, scope.function);
          scope.function = newFunction;
        }


        scope.selectedType = scope.function.selectedType;
        scope.typeList = scope.function.typeList;
        scope.delimiter = scope.function.delimiter;
        scope.sheetNames = scope.function.sheetNames;
        scope.selectedSheet = scope.function.selectedSheet;
        scope.extension = scope.function.extension;

      }


      }

  });

