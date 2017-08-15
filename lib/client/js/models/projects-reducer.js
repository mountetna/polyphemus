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
    default:
      return state;
  }
};

exports.default = projectReducer;