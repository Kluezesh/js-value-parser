'use strict';


const walker = {
  // other(target)
  CallExpression(node) { return node.arguments[0]; },
  // other && target
  LogicalExpression(node) { return node.right; },
  // target, other
  SequenceExpression(node) {
    let expressions = node.expressions;
    return expressions[expressions.length - 1];
  },
};


module.exports.FILTER_JSONP = function (ast) {
  for(let compare; compare !== ast;) {
    compare = ast;
    let type = ast.type;
    if(walker[type]) {
      ast = walker[type](ast);
    }
  }

  return ast;
};
