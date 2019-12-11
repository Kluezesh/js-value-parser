'use strict';


module.exports.extendContext = function (ctx, append) {
  let child = Object.create(ctx);

  if (typeof append === 'object') {
    Object.defineProperties(child, Object.getOwnPropertyDescriptors(append));
  }

  return child;
};
