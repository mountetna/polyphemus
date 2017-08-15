'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var ReactRedux = _interopRequireWildcard(_reactRedux);

var _permissionEdit = require('./permission-edit');

var _permissionEdit2 = _interopRequireDefault(_permissionEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapStateToProps = function mapStateToProps(state, ownProps) {

  // state == redux store
  return {

    adminInfo: state['adminInfo']
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {

  return {

    'addPermission': function addPermission() {

      var action = { 'type': 'ADD_PERMISSION' };
      dispatch(action);
    },

    'savePermission': function savePermission(permission) {

      var action = { 'type': 'SAVE_PERMISSION', 'permission': permission };
      dispatch(action);
    },

    'removeUnsavedPermission': function removeUnsavedPermission(reactKey) {

      var action = {

        'type': 'REMOVE_UNSAVED_PERMISSION',
        'reactKey': reactKey
      };
      dispatch(action);
    },

    'downloadPermissions': function downloadPermissions() {

      var action = { 'type': 'DOWNLOAD_PERMISSIONS' };
      dispatch(action);
    },

    'uploadPermissions': function uploadPermissions(file) {

      var action = { 'type': 'UPLOAD_PERMISSIONS', 'file': file };
      dispatch(action);
    },

    'removePermission': function removePermission(permission) {

      var action = { 'type': 'REMOVE_PERMISSION', 'permission': permission };
      dispatch(action);
    }
  };
};

var PermissionEditContainer = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(_permissionEdit2.default);

exports.default = PermissionEditContainer;