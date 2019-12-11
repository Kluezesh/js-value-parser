'use strict';

const { parseExpressionAt: parseAst } = require('acorn');

const { CONTEXT_MINIMUM } = require('./context/minimum');
const { FILTER_LEFTEST } = require('./filter/leftest');
const { EVALUATOR_CONSTANT } = require('./evaluator/constant');

const acornOptions = {};

/**
 * Usage:
 *   parse(str, [offset = 0], [options])
 *   --or--
 *   parse(ast, [options])
 *
 * example:
 *   const { parse } = require('js-value-parser');
 *   const acorn = require('acorn');
 *
 *   //from string
 *   parse('{a:1}');
 *   parse('123xxx7 {a:1} xxxx', 8)
 *
 *   //from ast
 *   parse(acorn.parse('{a:1}'));
 *
 */
module.exports.parse = function parse(msg, offset, options) {
  let ast;
  if(typeof msg === 'object') {
    // parse(ast, options)
    options = offset;
    ast = msg;
  } else {
    ast = parseAst(msg, offset || 0, acornOptions);
  }

  let context = (options && options.context) || CONTEXT_MINIMUM;
  let filter = (options && options.filter) || FILTER_LEFTEST;
  let evaluator = (options && options.evaluator) || EVALUATOR_CONSTANT;

  return evaluator(filter(ast), context);
};
