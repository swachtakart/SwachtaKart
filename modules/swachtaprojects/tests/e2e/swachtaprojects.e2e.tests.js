'use strict';

describe('Swachtaprojects E2E Tests:', function () {
  describe('Test Swachtaprojects page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/swachtaprojects');
      expect(element.all(by.repeater('swachtaproject in swachtaprojects')).count()).toEqual(0);
    });
  });
});
