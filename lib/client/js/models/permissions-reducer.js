'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var permission = function permission() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_PERMISSION':
      var user_email = action.user_email,
          project_name = action.project_name,
          role = action.role;

      return _extends({}, state, {
        user_email: user_email, project_name: project_name, role: role,
        key: GENERATE_RAND_KEY()
      });
    default:
      return state;
  }
};

var projectPermissions = function projectPermissions() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_PERMISSION':
      return _extends({}, state, _defineProperty({}, action.user_email, permission(state[action.user_email], action)));
    default:
      return state;
  }
};

var permissionsReducer = function permissionsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_PERMISSION':
      return _extends({}, state, _defineProperty({}, action.project_name, projectPermissions(state[action.project_name], action)));

    case 'REMOVE_UNSAVED_PERMISSION':
      var nextState = Object.assign({}, state);
      for (var a = 0; a < nextState['permissions']['length']; ++a) {

        if (nextState['permissions'][a]['reactKey'] == action['reactKey']) {

          nextState['permissions'].splice(a, 1);
        }
      }
      return nextState;

    case 'SAVE_PERMISSIONS':
      var nextState = Object.assign({}, state);
      return nextState;

    default:
      return state;
  }
};

exports.default = permissionsReducer;