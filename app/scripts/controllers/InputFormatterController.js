/**
 * Created by datagraft-nive on 8/8/2016.
 *
 * The controller of inputformatter.html
 * Handles different formats of tabular inputs and convert to CSV, using user inputs.
 *
 */
angular.module('grafterizerApp')
  .controller('InputFormatterControler', function ($scope, uploadFile, $state, $mdDialog) {

      $scope.typeList = ["CSV", "Excel", "Shape", "JSON"];

      var data = $scope.$parent.fileUpload;

      $scope.selectedType = getFileType(data);

      $scope.uploadSelected = function () {
        convert_excelsheets($scope.workbook, $scope.selectedSheet, $scope.$parent.fileUpload, function (file_upload) {
          uploadFile.upload(file_upload, function (data) {
            $state.go('transformations.transformation.preview', {
              distributionId: data.id
            });
          });
        });
        $mdDialog.hide();
      };

      function infer_type(file_name) {
        return file_name.substring(file_name.lastIndexOf(".") + 1, file_name.length);
      }

      function getFileType(file) {
        switch (infer_type(file.name)) {
          case 'csv':
            uploadFile.upload(file, function (data) {
              $state.go('transformations.transformation.preview', {
                distributionId: data.id
              });
            });
            return "CSV";
            break;
          case 'xls':
          case 'xlsx':
            getSheets(file);
            return "EXCEL";
            break;
          case 'json':
            return "JSON";
            break;
        }
      }

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

      function to_csv(workbook, sheetName) {
        var result = [];
        var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if (csv.length > 0) {
          result.push(csv);
        }
        return result.join("\n");
      }

      function convert_excelsheets(workbook, sheetName, file, callback) {
        var csv = to_csv(workbook, sheetName);
        var file_name = file.name;
        var file_to_upload = new File([csv], file_name.substring(0, file_name.length - 4) + ".csv", {type: "text/csv;charset=utf-8"});
        callback(file_to_upload);
      }


      //$scope.$watch('selectedType', function () {
      //  console.log("changed" + $scope.selectedType)
      //});

    }
  );


