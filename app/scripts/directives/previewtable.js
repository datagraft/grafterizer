'use strict';

/**
 * @ngdoc directive
 * @name grafterizerApp.directive:previewTable
 * @description
 * # previewTable
 */
angular.module('grafterizerApp')
  .directive('previewTable', function($q,$rootScope,transformationDataModel, $mdDialog) {

    var paginationSize = 100;

    return {
      template: '<div ui-grid="gridOptions" class="sin-grid md-whiteframe-z1"' +
        ' ui-grid-auto-resize ui-grid-resize-columns ui-grid-exporter ui-grid-infinite-scroll' +
        '><div class="watermark" ng-show="!gridOptions.data.length">\u2205</div></div>',
      restrict: 'E',
      scope: {
        data: '=ngModel',
        loadMore: '=ngLoadMore'
      },
      link: function postLink(scope, element, attrs) {
        scope.gridOptions = {
          data:  null,
          columnDefs: [],
          headerRowHeight: 82,
          rowHeight: 38,
          showHeader: !attrs.hasOwnProperty('hideHeaders'),
          exporterMenuCsv: true,
          exporterMenuPdf: false,
          converterDelimiter: true,
          delimiter: '\\,',
          enableGridMenu: true,
          enableMinHeightCheck: false,
          infiniteScrollUp: false,
          infiniteScrollDown: !!scope.loadMore,
          onRegisterApi: function(gridApi) {
            scope.gridApi = gridApi;

            if (scope.loadMore) {
              gridApi.infiniteScroll.on.needLoadMoreData(scope, scope.getDataDown);
            }

          }
        };

        scope.getDataDown = function() {
          scope.gridApi.infiniteScroll.saveScrollPercentage();
          var promise = $q.defer();
          scope.loadMore(function(err, data) {
            if (err) {
              scope.gridApi.infiniteScroll.dataLoaded(false, false);
              promise.reject();
              return;
            }

            if (!data.hasOwnProperty(':rows') || !data[':rows'].length) {
              scope.gridApi.infiniteScroll.dataLoaded(false, false);
              promise.resolve();
              return;
            }

            scope.gridOptions.data = scope.gridOptions.data.concat(data[':rows']);
            scope.gridApi.infiniteScroll.dataLoaded(
              false, data[':rows'].length >= paginationSize);
            promise.resolve();
          });

          return promise.promise;
        };

        scope.$watch('data', function() {
          var data = scope.data;
          if (!data || !data.hasOwnProperty(':rows')) {
            scope.gridOptions.data = [];

            if (scope.gridApi) {
              scope.gridApi.infiniteScroll.dataLoaded(false, false);
            }

            return;
          }

          var widths = {};
          var rawWidths = {};

          _.each(data[':column-names'], function(f) {
            if (f) {
              // the header size is 3 times more important
              widths[f] = f.length * 3;
            }
          });

          var rows = data[':rows'];
          var largest = 0;

          {
            var i;
            var key;
            var irow;
            var w;
            var maxIter = Math.min(10, rows.length);
            
            for (i = 0; i < maxIter; ++i) {
              for (key in rows[i]) {
                irow = rows[i][key];
                w = widths[key];

                if (w) {
                  widths[key] += ('' + irow).length;
                }
              }
            }

            var total = 0;
            for (key in widths) {
              widths[key] /= (maxIter + 3);
              rawWidths[key] = widths[key];
              total += widths[key];
            }

            for (key in widths) {
              widths[key] = w = widths[key] / total;
              if (w > largest) {
                largest = w;
              }
            }
          }
          scope.gridOptions.columnDefs =
            _.map(data[':column-names'], function(f) {
              var w = widths[f];
              var width = w === largest || isNaN(w) ? '*' : Math.floor(w * 100) + '%';
              var minWidth = isNaN(rawWidths[f]) ? 200 : Math.min(80 + rawWidths[f] * 8, 200);
              var colNameString = f[0] === ':' ? f.substring(1) : f;
              return {
                name: f,
                displayName: colNameString,
                width: width,
                minWidth: minWidth,
                cellTooltip: true,
               /* menuItems: [          
                    {
                      title: 'Assign data type',
                      action: function() {
                          var newScope = scope.$new(false,scope);
                          newScope.transformation = $rootScope.transformation;
                          newScope.colName = colNameString;
                          $mdDialog.show({
                              templateUrl :'views/pipelineFunctions/assignDatatypeDialog.html',
                              controller: 'AssignDatatypeControllerCtrl',
                              scope: newScope,
                              clickOutsideToClose: true
                          }).then(function(newFunct) {
                          });
                          

                      }
                    }]*/
              };
            });

          if (scope.gridApi) {
            scope.gridApi.infiniteScroll.dataLoaded(false, rows.length >= paginationSize);
          }
$rootScope.colnames = function() {
    var i;
    var namesArray = [];
    for (i=0;i<scope.gridOptions.columnDefs.length;++i) {
        var colname = {id:i,value:scope.gridOptions.columnDefs[i].displayName};
        namesArray.push(colname);
    }
    return namesArray;
};
          scope.gridOptions.data = rows;
        });
      }
    };
  });
