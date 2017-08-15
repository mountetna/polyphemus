'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeToken = exports.setToken = exports.getToken = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsCookie = require('js-cookie');

var Cookies = _interopRequireWildcard(_jsCookie);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var TOKEN_NAME = 'UCSF_ETNA_AUTH_TOKEN';

var COOKIE_PATH = { path: '/' };

var getToken = exports.getToken = function getToken() {
  return Cookies.get(TOKEN_NAME);
};
var setToken = exports.setToken = function setToken(token) {
  return Cookies.set(TOKEN_NAME, token, _extends({ expires: 1 }, COOKIE_PATH));
};
var removeToken = exports.removeToken = function removeToken() {
  return Cookies.remove(TOKEN_NAME, COOKIE_PATH);
};