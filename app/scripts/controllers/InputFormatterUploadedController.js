/**
 *
 * The controller of inputformatteruploaded.html. Used when Grafterizer is launched in upwizard mode
 * Handles different formats of tabular inputs and convert to CSV, using user inputs.
 *
 * Handles Excel spreadsheets and delimiter separated files and converts them to CSV.
 *
 */
angular.module('grafterizerApp')
  .controller('InputFormatterUploadedController', function ($scope, $mdDialog, transformationDataModel,$state, $rootScope) {

  var suggestExtension = function() {

        switch ($scope.selectedType) {
          case 'CSV':
            return "CSV";
            break;
          case 'Excel':
            return "xls";
            break;
          case 'Shape':
            return "zip"
            break;
          
        }
      };
    
      $scope.typeList = ["CSV", "Excel", "Shape"/*, "JSON"*/];

$scope.$watch('selectedType', function() {
        $scope.extension = suggestExtension();

});
      $scope.delimiter = ',';

      // uploads files according to given inputs
      $scope.proceed = function () {
          // always the first step is read dataset
          var uploadFunction = new transformationDataModel.UploadDatasetFunction(
            $scope.selectedType,
            $scope.typeList,
            $scope.delimiter,
            null,
            $scope.selectedSheet,
            $scope.extension,
            'Reads the input data for the data transformation. \n Cannot be moved or removed');
          if  ($scope.transformation.pipelines[0].functions.length!==0 && $scope.transformation.pipelines[0].functions[0].__type !== "UploadDatasetFunction" )
              {$scope.transformation.pipelines[0].functions.splice(0,0,uploadFunction);}
          else
           {
          $scope.transformation.pipelines[0].functions[0] // always the first step is read dataset
          =uploadFunction;
          }
         
          
        $rootScope.transformation = $scope.transformation;
          $rootScope.previewmode = true;
        $mdDialog.hide();
           
      };

     
     }
  );


