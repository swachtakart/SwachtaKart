'use strict';

describe('Swachtakartmaps E2E Tests:', function () {
  describe('Test Swachtakartmaps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/swachtakartmaps');
      expect(element.all(by.repeater('swachtakartmap in swachtakartmaps')).count()).toEqual(0);
    });
  });
});
