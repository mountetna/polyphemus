"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var permissionList = exports.permissionList = function permissionList(state) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(Object.values(state.permissions).map(function (project_permission) {
    return Object.values(project_permission);
  })));
};