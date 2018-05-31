"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _EventedObjectType = require("./EventedObjectType");

Object.keys(_EventedObjectType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _EventedObjectType[key];
    }
  });
});
//# sourceMappingURL=index.js.map