'use strict';
/**
 * @ngdoc service
 * @name grafterizerApp.uploadFile
 * @description
 * # uploadFile
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('uploadFile', function(backendService) {

    function infer_type(file_name) {
      return file_name.substring(file_name.lastIndexOf(".")+1, file_name.length);
    }

    function prepare_upload_file(file, callback) {
      switch(infer_type(file.name)) {
        case 'csv':
          callback(file);
          break;
        case 'xls':
        case 'xlsx':
          convert_excelsheets(file, callback);
          break;
      }
    }

    function convert_excelsheets(file, callback) {
      var reader = new FileReader();
      var ex = reader.readAsBinaryString(file);
      reader.onload = function (e) {
        var data = e.target.result;
        var csv = to_csv(XLSX.read(data, {type: 'binary'}));
        var file_name = file.name;
        var file_to_upload = new File([csv], file_name.substring(0, file_name.length - 4) + ".csv", {type: "text/csv;charset=utf-8"});
        callback(file_to_upload);
      };
    }

    function to_csv(workbook) {
      var result = [];
      var sheetName = workbook.SheetNames[0];
      //workbook.SheetNames[0].forEach(function(sheetName) {
      var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]); // get first sheet for now TODO modify according to user input
      if (csv.length > 0) {
        result.push(csv);
      }
      //}
      //);
      return result.join("\n");
    }
    this.upload = function(file, finalCallback) {
      //prepare_upload_file(file, function(file_upload){
        backendService.uploadDistribution(file, {
          title: 'Preview: ' + file.name,
          description: 'File uploaded from Grafterizer in preview mode'
        }).success(finalCallback);
      //});
    };
  });
