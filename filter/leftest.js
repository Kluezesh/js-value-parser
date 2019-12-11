'use strict';


const walker = {
  // target += other
  AssignmentExpression(node) { return node.left; },
  // target + other
  BinaryOperator(node) { return node.left; },
  // target || other
  LogicalExpression(node) { return node.left; },
  // target ? other : other2
  ConditionalExpression(node) { return node.test; },
  // target(other)
  CallExpression(node) { return node.callee; },
  // target, other
  SequenceExpression(node) { return node.expressions[0]; },
  // target++
  UpdateExpression(node) { return node.argument; },
};

module.exports.FILTER_LEFTEST = function (ast) {
  for (let compare; compare !== ast;) {
    compare = ast;
    let type = ast.type;
    if (walker[type]) {
      ast = walker[type](ast);
    }
  }

  return ast;
};
