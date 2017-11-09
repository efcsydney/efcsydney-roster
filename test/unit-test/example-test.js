const chai = require('chai');

const expect = chai.expect;

describe('Example', function() {
  describe('#hello', function() {
    it('try an example', function() {
      const fooValue = 1;
      expect(fooValue).to.equal(1);
      const fooObject = {a: 1};
      expect(fooObject).to.deep.equal({a: 1});
      const fooArray = [1, 2, 3];
      expect(fooArray).to.include(2);
      expect(true).to.be.true;
    });
  });
});