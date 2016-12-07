'use strict';

describe('Swachtamaps E2E Tests:', function () {
  describe('Test Swachtamaps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/swachtamaps');
      expect(element.all(by.repeater('swachtamap in swachtamaps')).count()).toEqual(0);
    });
  });
});
