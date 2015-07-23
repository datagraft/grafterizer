'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:MappingnodedefinitiondialogCtrl
 * @description
 * # MappingnodedefinitiondialogCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('MappingnodedefinitiondialogCtrl', function(
              $scope,
               $http,
               $mdDialog,
               $log,
               transformationDataModel,
               leObject) {

      var connection = leObject.serveraddress;
      var storage = leObject.storage;
      var object = leObject.object;

      var test = $scope.$parent.transformation;

      $scope.propertyValue = {
          value: ''
      };

      var vocabItemTemplate = {
          name: '',
          namespace: '',
          classes: [],
          properties: [],
          fromServer: false
      };


      var lowercaseTemplate = {
          name: '',
          lowercase:''
      }

      $scope.showSearchDialog = true;
      $scope.showManageDialog = false;
      $scope.showAddDialog = false;
      $scope.showProgress = false;
      $scope.hideToolbar = false;

      //search dialog
      $scope.showSearchResult  = false;
      $scope.showSearchEmptyResult = false;

      //vocabulary edit dialog
      $scope.showProgressCircular = false;

      //add vocabulary dialog
      $scope.showSearchPagination = false;
      $scope.showVocabularyPagination = false;
      $scope.namespaceInputDisable = false;
      $scope.dragProcess = false;

      $scope.dialogState = {};
      $scope.dialogState.selectedTab = 0;
      if (!$scope.newNode) {
        // we create a new node
        $scope.newNode = {};
      } else {
        // put dialog in the proper state
        switch ($scope.newNode.__type) {
          case 'ConstantURI':
          case 'ColumnURI':
            $scope.dialogState.selectedTab = 0;
            $scope.dialogState.mappingType = $scope.newNode.__type ===
              'ConstantURI' ? 'free-defined' : 'dataset-col';

            break;
          case 'ColumnLiteral':
          case 'ConstantLiteral':
            $scope.dialogState.selectedTab = 1;
            break;
          case 'BlankNode':
            $scope.dialogState.selectedTab = 2;
            break;
        }
      }

      $scope.changeType = function() {

        switch ($scope.dialogState.selectedTab) {
          case 0:
            if ($scope.dialogState.mappingType === 'dataset-col') {
              $scope.newNode = new transformationDataModel.ColumnURI($scope.newNode
                                                                     .prefix ? $scope.newNode.prefix : '', '', []);
            } else {
              if ($scope.newNode.__type !== 'ConstantURI') {
                $scope.newNode = new transformationDataModel.ConstantURI(
                  $scope.newNode.prefix ? $scope.newNode.prefix : '', '', []
                );
              } else {
                if (!$scope.newNode) {
                  $scope.newNode = new transformationDataModel.ConstantURI('',
                                                                           '', []);
                } else {
                  $scope.propertyValue.value = $scope.newNode.prefix + ':' +
                    $scope.newNode.constant;
                }
              }
            }
            break;
          case 1:
            if ($scope.dialogState.mappingType === 'dataset-col') {
              $scope.newNode = new transformationDataModel.ColumnLiteral('', []);

            } else {
              $scope.newNode = new transformationDataModel.ConstantLiteral('', []);
            }
            break;
          case 2:
            $scope.newNode = new transformationDataModel.BlankNode();
            // TODO not yet implemented
            break;
        }
      };

      $scope.closeDialog = function() {
        $mdDialog.cancel();
      };

      $scope.addNode = function() {

        if ($scope.propertyValue.value.indexOf(':') >= 0) {
          $scope.newNode.prefix = $scope.propertyValue.value.substring(0,
                                                                       $scope.propertyValue.value.indexOf(':'));
          $scope.newNode.constant = $scope.propertyValue.value.substring(
            $scope.propertyValue.value.indexOf(':') + 1, $scope.propertyValue
            .value.length);
        }

        $mdDialog.hide($scope.newNode);
      };

      $scope.propertyValue = {
        value: ''
      };


      $scope.currentPage = 0;
      $scope.pageSize = 5;
      $scope.items = [];
      $scope.numberOfPages = function() {
          return Math.ceil($scope.items.length / $scope.pageSize);
      };

      $scope.vocabcurrentPage = 0;
      $scope.vocabpageSize = 5;
      $scope.vocabnumberOfPages = function() {
          return Math.ceil($scope.VocabItems.length / $scope.vocabpageSize);
      };

      $scope.search = function(Para) {
          if (Para === undefined) {
              return;
          }

          $scope.showProgress = true;
          $scope.items = [];
          //get search result from server
          $http.get(
            connection + 'search/' +
              Para).success(
                  function(response) {
                      for (var i = response.classResult.length - 1; i >= 0; i--) {
                          $scope.items.push(response.classResult[i].value);
                      }
                      if ($scope.items.length > $scope.pageSize){
                          $scope.showSearchPagination = true;
                      }
                      else{
                          $scope.showSearchPagination = false;
                      }

                      if ($scope.items.length > 0){
                          $scope.showSearchResult = true;
                          $scope.showSearchEmptyResult = false;
                      }
                      else{
                          $scope.showSearchResult = false;
                          $scope.showSearchEmptyResult = true;
                      }

                      $scope.showProgress = false;
                  }).error(function(data, status, headers, config) {
                      console.log('error api/vocabulary/search');
                      $scope.showProgress = false;
          });

          //get search result from local
          var localVocabulary = JSON.parse(storage.getItem('localVocabulary'));

          for (var i = localVocabulary.length - 1; i >= 0; i--) {
              var ClassList = localVocabulary[i].classes;
              if (ClassList != null){
                  for( var item = ClassList.length - 1; item >= 0; item-- ){
                      if( ClassList[item].lowername.indexOf(Para.toLowerCase()) != -1 ) {
                          $scope.items.push(ClassList[item].name);
                      }
                  }
              }
          }

          $scope.currentPage = 0;
      };

      //show current saved vocabulary and operations
      $scope.switchToManageDialog = function() {
          $scope.selection = 'manageDialog';
          $scope.hideToolbar = true;
          //show local vocabulary
          var localVocabulary = JSON.parse(storage.getItem('localVocabulary'));

          var VocabList = [];
          if (localVocabulary != null){
              for (var i = localVocabulary.length - 1; i >= 0; i--) {
                  VocabList.push(localVocabulary[i]);
              }
          }

          $scope.VocabItems = VocabList;
          $scope.showProgressCircular = true;

          //show server vocabulary
          $http.get(
            connection + 'getAll'
          ).success(
              function(response) {
                  for (var i = response.result.length - 1; i >= 0; i--) {
                      vocabItemTemplate = new Object();
                      vocabItemTemplate.name = response.result[i].name;
                      vocabItemTemplate.namespace = response.result[i].namespace;
                      vocabItemTemplate.fromServer = true;

                      $scope.VocabItems.push(vocabItemTemplate);

                      if ($scope.VocabItems.length > $scope.pageSize){
                          $scope.showVocabularyPagination = true;
                      }
                      else{
                          $scope.showVocabularyPagination = false;
                      }
                  }
                  $scope.showProgressCircular = false;
              }).error(function(data, status, headers, config) {
                  console.log('error /api/vocabulary/getAll');
                  $scope.showProgressCircular = false;
          });
          $scope.showManageDialog = true;
          $scope.showSearchDialog = false;
          $scope.showAddDialog = false;
      };

      $scope.switchToSearchDialog = function() {
        $scope.selection = 'searchDialog';
        $scope.showManageDialog = false;
        $scope.showSearchDialog = true;
        $scope.showAddDialog = false;
        $scope.hideToolbar = false;
      };

      $scope.switchToAddDialog = function(name, namespace) {
          $scope.selection = 'addVocabDialog';

          $scope.showManageDialog = false;
          $scope.showSearchDialog = false;
          $scope.showAddDialog = true;
          $scope.hideToolbar = true;

          $scope.vocabName = null;
          $scope.vocabNamespace = null;

          $scope.localPath = false;
          $scope.remotePath = false;

          // if namespace is not null, then we are editing vocabulary,
          if (name != undefined){
              $scope.vocabName = name;
          }

          if (namespace != undefined && namespace != "") {
              $scope.vocabNamespace = namespace;
              $scope.namespaceInputDisable = true;
              $scope.addorEdit = "Edit";
          }
          else{
              $scope.namespaceInputDisable = false;
              $scope.addorEdit = "Add";
          }
      };

      //delete local vocabulary
      $scope.deleteItem = function(vocabNamespace) {
          //delete from local storage
          var localVocabulary = JSON.parse(storage.getItem('localVocabulary'));
          for (var i = localVocabulary.length - 1; i >= 0; i--) {
              if( localVocabulary[i].namespace === vocabNamespace ){
                localVocabulary.splice(i, 1);
              }
          }

          for (var i = $scope.VocabItems.length - 1; i >= 0; i--) {
              if ($scope.VocabItems[i].namespace === vocabNamespace){
                  $scope.VocabItems.splice(i, 1);
              }
          }

          storage.setItem('localVocabulary', JSON.stringify(localVocabulary));
      };

      //editing vocabulary
      $scope.editItem = function(name, namespace){
          $scope.switchToAddDialog(name, namespace);
      };

      //add vocabulary to local
      $scope.addVocabtoLocal = function(vocabName, vocabNamespace, vocabLoc) {
          if (vocabName === "" || vocabNamespace === "") {
              return;
          }

          // if path is empty, just add vocabulary name to local storage.
          if (vocabLoc === undefined && !object.data) {
              var localVocabulary = JSON.parse(storage.getItem('localVocabulary'));

              if ($scope.namespaceInputDisable === true){
                  for (var i = localVocabulary.length - 1; i >= 0; i--) {
                      if( localVocabulary[i].namespace === vocabNamespace ){
                          localVocabulary[i].name = vocabName;
                      }
                  }
              }
              else{
                  vocabItemTemplate = new Object();

                  vocabItemTemplate.name = vocabName;
                  vocabItemTemplate.namespace = vocabNamespace;
                  vocabItemTemplate.fromServer = false;

                  localVocabulary.push(vocabItemTemplate);
                  $rootScope.transformation.rdfVocabs.push(new transformationDataModel.RDFVocabulary(vocabName, vocabNamespace, [], []));
              }

              storage.setItem('localVocabulary', JSON.stringify(localVocabulary));

              $scope.switchToManageDialog();

              return;
          }

          if(vocabLoc === undefined || vocabLoc === ""){
            vocabLoc = object.filename;
          }

          $scope.showProgress = true;
          $http.post(
            connection + 'getClassAndPropertyFromVocabulary'
              , {
                  name: vocabName,
                  namespace: vocabNamespace,
                  path: vocabLoc,
                  data: object.data
              }).success(function(response) {
                  //add vocabulary name, a list of classes, a list of properties in local storage
                  var localVocabulary = JSON.parse(storage.getItem('localVocabulary'));

                  var classArray = [];
                  var propertyArray = [];
                  for (var i = response.classResult.length - 1; i >= 0; i--) {
                      //lower case is easier for search
                      lowercaseTemplate = new Object();
                      lowercaseTemplate.name = response.classResult[i].value;
                      lowercaseTemplate.lowername = response.classResult[i].value.toLowerCase();
                      classArray.push(lowercaseTemplate);
                      //console.log(response.classResult[i].value);
                  }
                  for (var i = response.propertyResult.length - 1; i >= 0; i--) {
                      lowercaseTemplate = new Object();
                      lowercaseTemplate.name = response.propertyResult[i].value;
                      lowercaseTemplate.lowername = response.propertyResult[i].value.toLowerCase();
                      propertyArray.push(lowercaseTemplate);
                      //console.log(response.propertyResult[i].value);
                  }
                  //console.log(response.classResult.length);
                  //console.log(response.propertyResult.length);

                  vocabItemTemplate = new Object();

                  if ($scope.namespaceInputDisable === true){
                    //editing vocabulary
                      for (var i = localVocabulary.length - 1; i >= 0; i--) {
                          if (localVocabulary[i].namespace === vocabNamespace){
                              localVocabulary[i].name = vocabName;
                              localVocabulary[i].classes = classArray;
                              localVocabulary[i].properties = propertyArray;
                          }
                      }
                  }
                  else {
                      //adding new vocabulary
                      vocabItemTemplate.name = vocabName;
                      vocabItemTemplate.namespace = vocabNamespace;
                      vocabItemTemplate.classes = classArray;
                      vocabItemTemplate.properties = propertyArray;
                      vocabItemTemplate.fromServer = false;

                      localVocabulary.push(vocabItemTemplate);
                  }

                  storage.setItem('localVocabulary', JSON.stringify(localVocabulary));

                  $scope.switchToManageDialog();
                  $scope.showProgress = false;
              }).error(function(data, status, headers, config) {
                  console.log('error api/vocabulary/getClassAndPropertyFromVocabulary');
                  $scope.showProgress = false;
              });
      };

      $scope.addResult = function(value) {
        $scope.propertyValue.value = value;
      };

      $scope.noOperation = function(){

      }

      // let us choose how to add vocabulary path
      //------------------------------------------
        $scope.choices = [
          "Add vocabulary path by url",
          "Add local vocabulary",
          "Add vocabulary later"
        ];

        $scope.localPath = false;
        $scope.remotePath = false;

        $scope.onChange = function(choice) {
            if (choice === "Add vocabulary path by url"){
              $scope.localPath = false;
              $scope.remotePath = true;
            }
            else if (choice === "Add local vocabulary") {
              $scope.localPath = true;
              $scope.remotePath = false;
            } else {
              $scope.localPath = false;
              $scope.remotePath = false;
            }
        };
        //-----------------------------------------
});
