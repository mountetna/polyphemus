'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var checkAdminPermissions = function checkAdminPermissions(perms) {
  return Object.values(perms).some(function (perm) {
    return perm.role == 'administrator' && perm.projectName == 'Administration';
  });
};

var user = function user(state, action) {
  if (!state) state = {};

  switch (action.type) {
    case 'ADD_USER':
      var email = action.email,
          first_name = action.first_name,
          last_name = action.last_name;

      return _extends({}, state, {
        email: email,
        first_name: first_name,
        last_name: last_name
      });
    default:
      return state;
  }
};

var usersReducer = function usersReducer(state, action) {
  if (!state) state = {};
  switch (action.type) {
    case 'ADD_USER':
      return _extends({}, state, _defineProperty({}, action.email, user(state[action.email], action)));
    default:
      return state;
  }
};

exports.default = usersReducer;