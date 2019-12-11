'use strict';


const handler = {
  Literal(node, ctx, evaluator) {
    if(node.regex && !node.value) {
      throw new Error('environment doesn\'t support regexp with flags ' + node.regex.flags);
    }

    return node.value;
  },
  Identifier(node, ctx, evaluator) {
    return ctx[node.name];
  },
  ThisExpression(node, ctx, evaluator) {
    return ctx;
  },
  ArrayExpression(node, ctx, evaluator) {
    return node.elements.map((expr) => {
      return evaluator(expr);
    });
  },
  ObjectExpression(node, ctx, evaluator) {
    return node.properties.reduce((obj, prop) => {
      let key = node.computed ? evaluator(prop.key) : prop.key.name;

      switch (prop.kind) {
      case 'init':
        obj[key] = evaluator(prop.value);
        break;

      case 'get':
        Object.defineProperty(obj, key, {
          get: evaluator(prop.value),
          enumerable: true,
          configurable: true,
        });
        break;

      case 'set':
        Object.defineProperty(obj, key, {
          set: evaluator(prop.value),
          enumerable: true,
          configurable: true,
        });
        break;

      default:
        throw new TypeError('ObjectExpression unknow property kind of "' + prop.kind + '"');
      }

      return obj;
    }, {});
  },
  FunctionExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  UnaryExpression(node, ctx, evaluator) {
    //only pass negative number, `void 0`, `!0`, `!1`
    if(
      node.operator === '-'
    ) {
      return -evaluator(node.argument);
    }

    if(
      node.operator === 'void' && node.argument.type === 'Literal' && node.argument.value === 0
    ) {
      return void 0;
    }

    if(
      node.operator === '!' &&
      node.argument.type === 'Literal' &&
      (node.argument.value === 0 || node.argument.value === 1)
    ) {
      return !node.argument.value;
    }

    throw new TypeError(node.type + ' is not allowed');
  },
  UpdateExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  BinaryExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  AssignmentExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  LogicalExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  MemberExpression(node, ctx, evaluator) {
    let obj = evaluator(node.object);

    if(!node.computed) {
      return obj[node.property.name];
    }

    return obj[evaluator(node.property)];
  },
  ConditionalExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  CallExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  NewExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
  SequenceExpression(node, ctx, evaluator) {
    throw new TypeError(node.type + ' is not allowed');
  },
};


module.exports.EVALUATOR_CONSTANT = function (ast, ctx) {
  const walker = (node) => {
    if(!handler[node.type]) {
      throw new Error(node.type + ' not implement yet');
    }

    return handler[node.type](node, ctx, walker);
  };

  return walker(ast);
};
