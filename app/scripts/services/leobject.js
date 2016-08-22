'use strict';
//TODO rename this from 'leobject' to something more meaningful
/**
 * @ngdoc service
 * @name grafterizerApp.leObject
 * @description
 * # leObject
 * Service in the grafterizerApp.
 */
angular.module('grafterizerApp')
  .service('leObject', function() {
    this.object = {};
    this.serveraddress = window.location.origin === 'http://localhost:8081' ?
      'https://grafterizer.datagraft.net/vocabularies/api/vocabulary/'
      : '/vocabularies/api/vocabulary/';

    //this.serveraddress = 'http://localhost:8080/VocabBackend/api/vocabulary/';
    this.validationOn = false;

  });
