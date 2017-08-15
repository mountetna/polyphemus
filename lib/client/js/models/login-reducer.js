'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var loginReducer = function loginReducer(state, action) {
  if (!state) state = {};
  switch (action.type) {
    case 'LOGGED_IN':
      return _extends({}, state, {
        current_user: action.email,
        error: null
      });
    case 'LOGGED_OUT':
      return _extends({}, state, {
        current_user: null,
        permissions: []
      });
    case 'LOG_ERROR':
      return _extends({}, state, {
        current_user: null,
        error: action.error
      });
    default:
      return state;
  }
};

exports.default = loginReducer;