'use strict';

const { expect } = require('chai');

const {
  parse,
  FILTER_JSONP
} = require('../');


describe('parse', function () {
  it('basical', function () {
    const result = parse('{a:[1,\'string\',true,false,null,-Infinity,undefined,!0,!1,void 0]}');
    expect(result).to.eql({ a: [1, 'string', true, false, null, -Infinity, undefined, !0, !1, void 0] });
  });

  it('offset', function () {
    const result = parse('xxx 1 xxx', 4);
    expect(result).to.eql(1);
  });

  it('jsonp', function () {
    const result = parse('jsonpCallback([2])', 0, { filter: FILTER_JSONP });
    expect(result).to.eql([2]);
  });
});
