/**
 * Created by datagraft-nive on 8/8/2016.
 *
 * The controller of inputformatter.html
 * Handles different formats of tabular inputs and convert to CSV, using user inputs.
 *
 * Handles Excel spreadsheets and delimiter separated files and converts them to CSV.
 *
 */
angular.module('grafterizerApp')
  .controller('InputFormatterControler', function ($scope, uploadFile, $mdDialog, transformationDataModel,$state, $rootScope, callback) {


      $scope.typeList = ["CSV", "Excel", "Shape"/*, "JSON"*/];

      $scope.selectedType = getFileType($scope.$parent.fileUpload);

      $scope.delimiter = ',';

      // uploads files according to given inputs
      $scope.uploadSelected = function () {

        $scope.transformation.pipelines[0].functions[0]
          =new transformationDataModel.UploadDatasetFunction(
            $scope.selectedType,
            $scope.typeList,
            $scope.delimiter,
            $scope.sheetNames,
            $scope.selectedSheet,
            $scope.extension,
            'upload-data');
        $rootScope.transformation = $scope.transformation;
        uploadProcessedFile($scope.$parent.fileUpload);
        $mdDialog.hide();
      };

      //uploads file and redirects to preview service
      var uploadProcessedFile = function (file_upload) {
        uploadFile.upload(file_upload, callback);
      };

      // infers file type from the file format extension
      function infer_type(file_name) {
        return file_name.substring(file_name.lastIndexOf(".") + 1, file_name.length);
      }

      // identifies file type and sheet to process with user input
      function getFileType(file) {
        $scope.extension = infer_type(file.name);
        switch ($scope.extension) {
          case 'csv':
          case 'txt':
          case 'tsv':
            return "CSV";
            break;
          case 'xls':
          case 'xlsx':
            getSheets(file);
            return "Excel";
            break;
          case 'zip':
            return "Shape"
            break;
          case 'json':
            return "JSON";
            break;
        }
      }

      // loads available sheets in the file and gets selected sheet name by user
      function getSheets(file) {
        var reader = new FileReader();
        var ex = reader.readAsBinaryString(file);
        reader.onload = function (e) {
          var data = e.target.result;
          $scope.workbook = XLSX.read(data, {type: 'binary'});
          $scope.sheetNames = $scope.workbook.SheetNames;
          $scope.selectedSheet = $scope.sheetNames[0];
        };
      }

      //// converts selected sheet to csv
      //function to_csv(workbook, sheetName) {
      //  var result = [];
      //  var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
      //  if (csv.length > 0) {
      //    result.push(csv);
      //  }
      //  return result.join("\n");
      //}
      //
      //// converts selected sheet to csv
      //function convert_excelsheets(workbook, sheetName, file, callback) {
      //  //var csv = to_csv(workbook, sheetName);
      //  //var file_name = file.name;
      //  //var file_to_upload = new File([csv], file_name.substring(0, file_name.length - 4) + ".csv", {type: "text/csv;charset=utf-8"});
      //  callback(file);
      //}
      //
      //// converts selected file using given delimiter
      //function convert_delimiter_to_csv(file, delimiter, callback) {
      //  //var reader = new FileReader();
      //  //var ex = reader.readAsBinaryString(file);
      //  //reader.onload = function (e) {
      //  //  var data = e.target.result;
      //  //  var csv =data.replace(new RegExp(delimiter, 'g'), ","); // replaces all delimiters to csv
      //  //  var file_name = file.name;
      //  //  var file_to_upload = new File([csv], file_name.substring(0, file_name.length - 4) + ".csv", {type: "text/csv;charset=utf-8"});
      //  //  callback(file_to_upload);
      //  //};
      //  callback(file);
      //}
    }
  );


