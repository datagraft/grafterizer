'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:CustomStringfunctionsdialogcontrollerCtrl
 * @description
 * # CustomStringfunctionsdialogcontrollerCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
    .controller('CustomStringfunctionsdialogcontrollerCtrl', function (
        $scope, transformationDataModel, $mdToast, $mdDialog) {

        $scope.functionCodeOptions = {
            name: '',
            docstring: '',
            textCaseOption: '',
            textTrimOption: '',
            substr: [null, null],
            replaceMap: [null, null]
        };

        var changeSampleCase = function(sampleCase) {
             var w;
             switch (sampleCase) {
                        case ('clojure.string/upper-case'):
                            $scope.sample = $scope.sample.toUpperCase();
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('clojure.string/lower-case'):
                            $scope.sample = $scope.sample.toLowerCase();
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('clojure.string/capitalize'):
                            w = $scope.sample.match(/\w/);
                            $scope.sample = $scope.sample.toLowerCase();
                            if ($scope.sample.charCodeAt(w.index) > 96 && $scope.sample.charCodeAt(w.index) < 123) $scope.sample =
                                $scope.sample.substr(0, w.index) + String.fromCharCode($scope.sample.charCodeAt(w.index) - 32) +
                                $scope.sample.substr(w.index + 1);
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('titleize'):

                            $scope.sampleToReplace = $scope.sample.replace(/\w\S*/g, function (txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                            });
                            $scope.sample = $scope.sampleToReplace;
                            break;
                        default:
                            $scope.sample = $scope.sampleOrigin;
                            $scope.sampleToReplace = $scope.sample;
                            changeSampleSubstr($scope.functionCodeOptions.substr[0],$scope.functionCodeOptions.substr[1]);
                            break;
                    }
        };
    
     var changeSampleTrim = function(sampleTrim) {
         var w;
             switch (sampleTrim) {
                        case ('clojure.string/trim'):
                            $scope.sampleToReplace = $scope.sample;
                            $scope.sample = $scope.sample.trim();
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('clojure.string/triml'):
                            w = $scope.sample.match(/\w/);
                            $scope.sample = $scope.sample.substr(w.index);
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('clojure.string/trimr'):
                            var wspattern = /\w/g;

                            while (wspattern.test($scope.sample)) w = wspattern.lastIndex;

                            $scope.sample = $scope.sample.substr(0, w);
                            $scope.sampleToReplace = $scope.sample;
                            break;
                        case ('clojure.string/trim-newline'):
                            $scope.sample = $scope.sample.replace(/\n/g, '');
                            break;
                        case ('remove-blanks'):
                            $scope.sample = $scope.sample.replace(/ +/g, '');
                            break;
                        default:
                            break;
                    }
        };
    
    var changeSampleSubstr = function(from, to) {
             if (to)
                        $scope.sample = $scope.sampleOrigin.substr(from, to - from);
                    else $scope.sample = $scope.sampleOrigin.substr(from);
                    $scope.sampleToReplace = $scope.sample;
                    if ($scope.functionCodeOptions.textCaseOption !== '') {
                        changeSampleCase($scope.functionCodeOptions.textCaseOption);
                    }
                   
    }
    
     var changeSampleReplace = function(replaceMap) {
                    var i;
        console.log($scope.functionCodeOptions.replaceMap[0]);
         if ($scope.functionCodeOptions.replaceMap[0] !== '')
                        for (i = 0; i < $scope.functionCodeOptions.replaceMap.length; i += 2) {
                            var replacePattern = new RegExp($scope.functionCodeOptions.replaceMap[i].toString(), 'g');
                            $scope.sample = $scope.sampleToReplace.replace(replacePattern, ($scope.functionCodeOptions.replaceMap[i +
                                1] ? $scope.functionCodeOptions.replaceMap[i + 1].toString() : ''));
                        }
    }
    
    
        $scope.getMapLength = function (num) {
            var b = [];
            for (var i = 0; i <= num / 2; i += 2) b.push(i);
            return b;
        };
    
        $scope.$watch('functionCodeOptions.textCaseOption', function (value) {
          changeSampleCase(value);
        });
    
        $scope.$watch('functionCodeOptions.textTrimOption', function (value) {
            changeSampleTrim(value);
        });
    
        $scope.$watch('substr', function (value) {
            if (!value) {
                $scope.functionCodeOptions.substr[0] = null;
                $scope.functionCodeOptions.substr[1] = null;
            }
        });

    $scope.$watch('functionCodeOptions.substr', function () {
         changeSampleSubstr($scope.functionCodeOptions.substr[0],$scope.functionCodeOptions.substr[1]);
        }, true);
        
    
       $scope.$watch('replace', function (value) {
            if (!value) {
               $scope.functionCodeOptions.replaceMap = [null, null];
                $scope.sample = $scope.sampleOrigin;
                $scope.sampleToReplace = $scope.sample;
                changeSampleCase($scope.functionCodeOptions.textCaseOption);
                changeSampleTrim($scope.functionCodeOptions.textTrimOption);
 changeSampleSubstr($scope.functionCodeOptions.substr[0],$scope.functionCodeOptions.substr[1]);
                
            }
        });
    
    
    $scope.$watch('functionCodeOptions.replaceMap', function (value) {
        if ($scope.functionCodeOptions.replaceMap[0]) 
            changeSampleReplace(value);
        }, true);
    
        $scope.emptyCustomFunction = new transformationDataModel.CustomFunctionDeclaration(
            '', '', '', '');

        $scope.saveCustomFunct = function () {
            if (!$scope.functionCodeOptions.name) $scope.functionCodeOptions.name = 'transform-text';
            if (!$scope.functionCodeOptions.docstring) $scope.functionCodeOptions.docstring = 'Transforms text';

            var options = $scope.functionCodeOptions;
            var functionCode = '(defn ' + options.name + ' "' + options.docstring + '" [s]  (->   s ' +
                options.textCaseOption + ' ' +
                options.textTrimOption + ' ';
            if (options.substr[0] || options.substr[1]) {
                functionCode += '(subs ' + (options.substr[0] ? options.substr[0] : '0');
                if (options.substr[1]) functionCode += ' ' + options.substr[1];
                functionCode += ') ';
            }
            if (!(options.replaceMap[0] === null && options.replaceMap[1] === null))
                for (var i = 0; i < options.replaceMap.length; i += 2)

            functionCode += '(clojure.string/replace "' + (options.replaceMap[i] ? options.replaceMap[i] : '') + '" "' + (
                options.replaceMap[i + 1] ? options.replaceMap[i + 1] : '') + '") ';
            functionCode += '))';
            var result = $scope.$parent.transformation.addCustomFunctionDeclaration($scope.functionCodeOptions.name,
                functionCode, 'UTILITY', $scope.functionCodeOptions.docstring);

            if (!result) {
                $mdToast.show(
                    $mdToast.simple()
                    .content('Function with this name already exists.')
                    .position('bottom left')
                    .hideDelay(2000)
                );
            } else {
                $mdToast.show(
                    $mdToast.simple()
                    .content('New text transformation function created.')
                    .position('bottom left')
                    .hideDelay(2000)
                );
            }
        };

        $scope.addMapPair = function () {
            $scope.functionCodeOptions.replaceMap.push(null);
            $scope.functionCodeOptions.replaceMap.push(null);
            $scope.sampleToReplace = $scope.sample;
        };

        $scope.removeMapPair = function (index) {
            $scope.functionCodeOptions.replaceMap.splice(index, 2);
            $scope.sampleToReplace = $scope.sample;
        };

        $scope.sample =
            ' This is  sample text. \n \n Here you may see the effect of \n transformations on your  text data. \n For more complex transformations use \n [Edit utility functions] option.    ';
        $scope.sampleOrigin =
            ' This is  sample text. \n \n Here you may see the effect of \n transformations on your  text data. \n For more complex transformations use \n [Edit utility functions] option.    ';
        $scope.sampleToReplace = '';


        $scope.trimOptions = [
            {
                name: 'do not trim',
                code: ''
      },
            {
                name: 'trim both sides',
                code: 'clojure.string/trim'
      },
            {
                name: 'trim left side',
                code: 'clojure.string/triml'
      },
            {
                name: 'trim right side',
                code: 'clojure.string/trimr'
      },
            {
                name: 'trim newlines',
                code: 'clojure.string/trim-newline'
      },
            {
                name: 'remove all blank space',
                code: 'remove-blanks'
      }
    ];
        $scope.caseOptions = [
            {
                name: 'preserve case',
                code: ''
      },
            {
                name: 'UPPER CASE',
                code: 'clojure.string/upper-case'
      },
            {
                name: 'lower case',
                code: 'clojure.string/lower-case'
      },
            {
                name: 'Capitalize string',
                code: 'clojure.string/capitalize'
      },
            {
                name: 'Capitalize Each Word',
                code: 'titleize'
      }
    ];

        $scope.applyCustomFunctionChanges = function () {
            $scope.saveCustomFunct();
            $mdDialog.hide();
        };

        $scope.cancelCustomFunctionChanges = function () {
            $mdDialog.cancel();
        };

        $scope.createNewFunct = function () {
            var name = '';
            var docstring = '';
            $scope.emptyCustomFunction.name = name;
            $scope.emptyCustomFunction.clojureCode = '(defn ' + name + ' "" [] ())';
            $scope.emptyCustomFunction.docstring = docstring;
            $scope.emptyCustomFunction.group = 'UTILITY';
            $scope.selectedCustomFunction = $scope.emptyCustomFunction;
            $scope.saveCustomFunct();
        };

    });
