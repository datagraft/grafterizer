'use strict';

describe('Controller: ComputetriplesCtrl', function () {

  // load the controller's module
  beforeEach(module('grafterizerApp'));

  var $controller, ComputetriplesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$controller_, _$rootScope_) {
    scope = _$rootScope_.new();
    $controller = _$controller_;
    ComputetriplesCtrl = $controller('ComputetriplesCtrl', {$scope: scope});
  }));

  it('controller to be defined', function () {
    expect(ComputetriplesCtrl).toBeDefined;
  });
});
