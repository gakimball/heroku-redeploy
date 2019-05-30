const {expect} = require('chai');
const deployer = require('../lib/deployer');

const args = ['one=app-one&two=app-two', '12345'];

describe('Express handler', () => {
  it('throws if env query string is not set', () => {
    expect(() => deployer()).to.throw(Error);
  });

  it('throws if API key is not set', () => {
    expect(() => deployer(args[0])).to.throw(Error);
  });

  it('returns a function', () => {
    expect(deployer(...args)).to.be.a('function');
  });
});
