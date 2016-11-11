'use strict';

describe('Service: transformationDataModel', function () {

  // load the service's module
  beforeEach(module('grafterizerApp'));

  // instantiate service
  var transformationDataModel;
  beforeEach(inject(function (_transformationDataModel_) {
    transformationDataModel = _transformationDataModel_;
  }));

  /*it('should do something', function () {
    expect(!!transformationDataModel).toBe(true);
  });*/
    it('Service should exist', function() {
        expect(transformationDataModel).toBeDefined();
          });
    /*it('Spec to test 2+2', function () {
            expect(2+2).toBe(3);
              });*/
});
