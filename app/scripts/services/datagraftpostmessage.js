'use strict';

/**
 * @ngdoc service
 * @name grafterizerApp.datagraftPostMessage
 * @description
 * # datagraftPostMessage
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
.service('datagraftPostMessage', function(
  $rootScope,
  $state,
  uploadFile) {

  var channel = 'datagraft-post-message';
  var connected = false;

  var receiveMessage = function(event) {
    var data = event.data;
    if (!data || !data.channel || data.channel !== channel) return;

    try {
      switch (data.message) {
        case 'state.go':
          $state.go(data.state, data.toParams);
          break;
        case 'upload-and-new':
          var file = new Blob([data.distribution], {type: data.type});
          file.name = data.name;
          uploadFile.upload(file, function(data) {
            $rootScope.actions.save(data.id);
          });

          break;
      }
    } catch (e) {
      Raven.captureException(e);
    }
  };

  this.setup = function() {
    window.addEventListener('message', receiveMessage, false);
    window.parent.postMessage({
      channel: channel,
      message: 'ready'
    }, '*');
  };

  this.isConnected = function() {
    return connected;
  };

  this.setLocation = function(location) {
    window.parent.postMessage({
      channel: channel,
      message: 'set-location',
      location: location
    }, '*');
  };
});
