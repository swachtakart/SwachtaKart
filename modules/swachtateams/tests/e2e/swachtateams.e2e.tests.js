'use strict';

describe('Swachtateams E2E Tests:', function () {
  describe('Test Swachtateams page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/swachtateams');
      expect(element.all(by.repeater('swachtateam in swachtateams')).count()).toEqual(0);
    });
  });
});
