# js-value-parser
deserialize javascript objects including non-standard JSON in fragmented text

## Installation
```
npm install js-value-parser
```

## Useage

parse(msg, \[offset, \[options]\])

parse(ast, \[options\])

#### example:
```javascript
const {
  parse,
  FILTER_JSONP,
} = require('js-value-parser');

const msg = '... xxx = {a:1} ... ';
console.log(parse(msg, msg.indexOf('=') + 1)); // => { a : 1 }

console.log(parse('jsonpCallback([2])', 0, {filter: FILTER_JSONP})); // => [2]
```

#### options

`context` - the value map of identifier refers, default `CONTEXT_MINIMUM`

`filter` - find the target ast node, default `FILTER_LEFTEST`

`evaluator` - calculate ast's values, default `EVALUATOR_CONSTANT`

## Components
- context
    - `CONTEXT_MINIMUM`: only include `undefined`, `Infinity`, `NaN`

- filter
    - `FILTER_LEFTEST`: find the ast node of object or constant on the left side
    - `FILTER_JSONP`: find the ast node of the first argument of function calling

- evaluator
    - `EVALUATOR_CONSTANT`: turn `!0`,`!1`,`void 0` into `true`,`false`,`undefined`, then statically evaluating constant value (object, array, string, number, boolean, null & refers in context), otherwise throw an error (e.g. invoke function)
