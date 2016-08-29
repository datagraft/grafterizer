'use strict';

/**
 * @ngdoc function
 * @name grafterizerApp.controller:ComputetriplesCtrl
 * @description
 * # ComputetriplesCtrl
 * Controller of the grafterizerApp
 */
angular.module('grafterizerApp')
  .controller('ComputetriplesCtrl', function(
    $scope,
    $rootScope,
    $mdDialog,
    $stateParams,
    backendService,
    PipeService,
    datagraftPostMessage,
    jarfterService,
    $sanitize) {
 $scope.RDFformats = [
            {
                format: 'nt'
                , description: 'N-Triples (.nt)'
            }
            
            , {
                format: 'rdf'
                , description: 'RDF/XML (.rdf)'
            }
        
            , {
                format: 'ttl'
                , description: 'Turtle (.ttl)'
            }
            
            , {
                format: 'nq'
                , description: 'N-Quads (.nq)'
            }
            , {
                format: 'n3'
                , description: 'N3 (.n3)'
            }
            
            , {
                format: 'trix'
                , description: 'TriX (.trix)'
            }
            , {
                format: 'trig'
                , description: 'TriG (.trig)'
            },
        ];
        var filetypeFlag = false;
    for (var i = 0; i < $rootScope.flags.length; ++i)
            if ($rootScope.flags[i].key === "filetypeToggling") {
                filetypeFlag = $rootScope.flags[i].active;
                break;
            }
        console.log(filetypeFlag);
    
    $scope.distribution = $stateParams.distributionId;

    $scope.transformation = $stateParams.id;

     if (!filetypeFlag) {
            $scope.type = 'pipe';
            if ($rootScope.transformation.graphs &&
                $rootScope.transformation.graphs.length !== 0) {
                $scope.type = 'graft';
            }
            $scope.downloadLink = PipeService.computeTuplesHref(
                $scope.distribution, $scope.transformation, $scope.type);
        } else {
            $scope.type = 'pipe';
            if (typeof $scope.outRDF === 'undefined') $scope.outRDF = false;   
            $scope.downloadLink = PipeService.computeTuplesHref(
                $scope.distribution, $scope.transformation, $scope.type, 'nt');
            $scope.$watch('outRDF', function (value) {
                $scope.outRDF = value;
                if (value) {
                    if ($rootScope.transformation.graphs &&
                        $rootScope.transformation.graphs.length !== 0) {
                        $scope.type = 'graft';
                    }
                }
                   $scope.downloadLink = PipeService.computeTuplesHref(
                    $scope.distribution, $scope.transformation, value ? $scope.type : 'pipe', 'nt');
                console.log(value);
                console.log($scope.type);
            });
            $scope.$watch('RDFformat', function (value) {
                if ($scope.type == 'graft') {
                var rdfFormat;
                for (var i = 0; i < $scope.RDFformats.length; ++ i)
                    if ($scope.RDFformats[i].description === value)
                        rdfFormat = $scope.RDFformats[i].format;
                    
                $scope.downloadLink = PipeService.computeTuplesHref(
                    $scope.distribution, $scope.transformation, value ? $scope.type : 'pipe', rdfFormat);
                }
            });
        }
 /* $scope.type = 'pipe';
    if ($rootScope.transformation.graphs &&
      $rootScope.transformation.graphs.length !== 0) {
      $scope.type = 'graft';
    }

    $scope.downloadLink = PipeService.computeTuplesHref(
      $scope.distribution, $scope.transformation, $scope.type);*/

    $scope.lastPreviewDuration = PipeService.getLastPreviewDuration();
    $scope.verySlowMode = $scope.lastPreviewDuration > 25000;
    // $scope.verySlowMode = $scope.lastPreviewDuration > 25;

    $scope.ugly = function() {
      // TODO fixme
      window.setTimeout(function() {
        $mdDialog.hide();
      }, 1);
    };

    $scope.isRDF = $rootScope.transformation.graphs.length ? $rootScope.transformation.graphs.length : 0;
    console.log($scope.isRDF);
    $scope.downloadJarEndpoint = jarfterService.getJarCreatorStandAloneEndpoint();
    $scope.transformEndpoint = jarfterService.getTransformStandAloneEndpoint();

    $scope.onSubmitDownloadJar = function() {
      $scope.jarfterClojure = jarfterService.generateClojure($rootScope.transformation);
      $mdDialog.hide();
    };

    $scope.startDownloadProcessing = function() {
      if ($scope.downloadLinkSlowMode) {
        $scope.ugly();
        return;
      }

      $scope.downloadProcessing = true;
      $scope.downloadProcessingStatus = 'Preheating';

      var promises = PipeService.computeTuplesHrefAsync(
        $scope.distribution, $scope.transformation, $scope.type);

      var intervalEstimatedStuff = 0;

      promises.middle.then(function() {
        $scope.downloadProcessingStatus = 'Computing stuff';

        var startTime = +new Date();
        intervalEstimatedStuff = window.setInterval(function() {
          var duration = (+new Date()) - startTime;

          var durationLeft = $scope.lastPreviewDuration + 5000 - duration;
          $scope.downloadProcessingStatus = 'Estimated end of the processing: ' +
            moment.duration(durationLeft).humanize(true);
        }, 1000);
      });

      promises.final.then(function(data) {
          window.clearInterval(intervalEstimatedStuff);

          $scope.downloadLinkSlowMode = data.url;
          $scope.downloadProcessing = false;
          $scope.downloadProcessingStatus = null;
          $scope.slowModeThanks = true;
        },

        function() {
          window.clearInterval(intervalEstimatedStuff);
          $scope.downloadProcessingStatus = 'Unable to compute the data. Please try again';
        });
    };

    /*var showError = function(data) {
      $mdDialog.hide();

      var contentError = '';

      if (data && data.error) {
        contentError = '<br><pre><code>' + $sanitize(data.error) + '</code></pre>';
      }

      window.setTimeout(function() {
        $mdDialog.show(
          $mdDialog.alert({
            title: 'An error occured',
            content: 'The datapage cannot be created.' +
              '<br>Last processing status: "' + $scope.processingStatus + '"' +
              contentError,
            ok: 'Ok'
          })
        );
      }, 500);
    };*/

    var executeAndSaveToQDS = function(accessUrl) {
      PipeService.fillRDFrepo($scope.distribution, $scope.transformation, accessUrl).success(function(data) {
        $scope.processing = false;
        $scope.ugly();
        $mdDialog.show(
          $mdDialog.alert({
            title: 'It\'s a success',
            content: 'The data has correctly been save in the queriable data store.',
            ok: 'Ok'
          })
        );
      }).error(function() {
        $scope.processing = false;
      });
    };

    $scope.executeAndSave = function() {
      $scope.processing = true;

      if ($scope.selectedQDS === 'new') {
        $scope.processingStatus = 'Creating the Queriable Data Store';
        // TODO check this
        window.alert('Not implemented');
      } else {
        executeAndSaveToQDS($scope.selectedQDS);
      }
    };

    /*$scope.makeNewDataset = function() {

      $scope.processing = true;
      $scope.processingStatus = 'Making the dataset';

      var today = new Date();
      today = today.toISOString().substring(0, 10);

      var metadataDataset = {
        '@context': ontotextAPI.getContextDeclaration(),
        'dct:title': $scope.dataset.title,
        'dct:description': $scope.dataset.description,
        'dcat:public': 'false',
        'dct:modified': today,
        'dct:issued': today
      };

      ontotextAPI.newDataset(metadataDataset)
        .success(function(datasetData) {
          var datasetId = datasetData['@id'];

          $scope.processingStatus = 'Transforming the data';
          PipeService.save(datasetId, $scope.distribution,
            $scope.transformation, $scope.type).success(
            function(distributionData) {

              var distributionId = distributionData['@id'];

              $scope.processingStatus = 'Fetching information';
              ontotextAPI.distribution(distributionId)
                .success(function(metadataDistribution) {

                  var finalizeDatapage = function() {

                    var location = '/pages/publish/details.jsp?id=' +
                      window.encodeURIComponent(datasetId);

                    if (datagraftPostMessage.isConnected()) {
                      datagraftPostMessage.setLocation(location);
                    } else {
                      if (location.protocol === 'https:') {
                        location = 'https://datagraft.net' + location;
                      } else {
                        location = 'http://datagraft.net' + location;
                      }

                      window.location = location;
                    }
                  };

                  if ($scope.type === 'pipe') {
                    finalizeDatapage();
                    return;
                  }

                  $scope.processingStatus = 'Creating the RDF repository';
                  ontotextAPI.createRepository(distributionId)
                    .success(function(repositoryData) {
                      var accessUrl = repositoryData['access-url'];

                      metadataDistribution['dcat:accessURL'] = accessUrl;

                      $scope.processingStatus = 'Connecting the repository to the distribution';
                      ontotextAPI.updateDistribution(metadataDistribution)
                        .success(function() {

                          $scope.processingStatus = 'Filling the repository';

                          var nbTryToFillRDFrepo = 0;
                          var waitingDelay = 1000;
                          var maxTentatives = 20;

                          var tryToFillRDFrepo = function() {
                            ++nbTryToFillRDFrepo;
                            if (tryToFillRDFrepo > 3) {
                              $scope.processingStatus = 'The repository is not ready yet. It might take few minutes.';
                            }
                            waitingDelay = Math.min(waitingDelay + waitingDelay, 32000);

                            window.setTimeout(function() {
                              PipeService.fillRDFrepo(distributionId, accessUrl)
                                .success(finalizeDatapage)
                                .error(nbTryToFillRDFrepo < maxTentatives ? tryToFillRDFrepo :
                                  showError);
                            }, waitingDelay);
                          };

                          tryToFillRDFrepo();

                        }).error(showError);
                    }).error(showError);
                }).error(showError);
            }).error(showError);
        }).error(showError);
    };*/

    // Load the queriable data stores from datagraft
    backendService.queriableDataStores().success(function(data) {
      $scope.QDSs = data['dcat:record'];
    });

    $scope.cancel = function() {
      $mdDialog.cancel();
    };
  });
