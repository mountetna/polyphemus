'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var project = function project(state, action) {
  if (!state) state = {};
  switch (action.type) {
    case 'ADD_PROJECT':
      var project_name = action.project_name,
          group_name = action.group_name,
          project_full_name = action.project_full_name;

      return _extends({}, state, {
        project_name: project_name, group_name: group_name, project_full_name: project_full_name
      });
    default:
      return state;
  }
};

var projectReducer = function projectReducer(state, action) {
  if (!state) state = {};
  switch (action.type) {
    case 'ADD_PROJECT':
      return _extends({}, state, _defineProperty({}, action.project_name, project(state[action.project_name], action)));
    case 'HAS_PERMISSIONS':
      // Generate some random id's for react keys.
      for (var a = 0; a < adminInfo.permissions.length; ++a) {
        adminInfo['permissions'][a]['reactKey'] = GENERATE_RAND_KEY();
      }

      adminInfo['permissions'].reverse();
      return adminInfo;

    case 'ADD_PERMISSION':
      var adminInfo = Object.assign({}, state);

      var randKey = GENERATE_RAND_KEY();
      var newPermission = {

        'id': null,
        'projectId': null,
        'projectName': '',
        'role': '',
        'userEmail': '',
        'userId': null,
        'reactKey': randKey
      };

      adminInfo['permissions'].unshift(newPermission);
      return adminInfo;

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

    case 'HAS_USERS':

      var adminInfo = Object.assign({}, state);
      adminInfo['users'] = undefined.camelCaseIt(action['data']);
      return adminInfo;

    case 'HAS_PROJECTS':

      var adminInfo = Object.assign({}, state);
      adminInfo['projects'] = undefined.camelCaseIt(action['data']);
      return adminInfo;

    default:

      var nextState = Object.assign({}, state);
      return nextState;
  }
};

exports.default = projectReducer;