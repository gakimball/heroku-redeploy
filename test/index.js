const {expect} = require('chai');
const handler = require('../lib/handler');

const args = ['one=app-one&two=app-two', '12345'];

describe('Express handler', () => {
  it('throws if env query string is not set', () => {
    expect(() => handler()).to.throw(Error);
  });

  it('throws if API key is not set', () => {
    expect(() => handler(args[0])).to.throw(Error);
  });

  it('returns a function', () => {
    expect(handler(...args)).to.be.a('function');
  });
});
