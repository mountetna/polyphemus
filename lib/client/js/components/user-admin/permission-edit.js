'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _permissionEntry = require('./permission-entry');

var _permissionEntry2 = _interopRequireDefault(_permissionEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PermissionEdit = function (_React$Component) {
  _inherits(PermissionEdit, _React$Component);

  function PermissionEdit() {
    _classCallCheck(this, PermissionEdit);

    return _possibleConstructorReturn(this, (PermissionEdit.__proto__ || Object.getPrototypeOf(PermissionEdit)).call(this));
  }

  _createClass(PermissionEdit, [{
    key: 'selectFile',
    value: function selectFile() {
      /*
       * We are using a button to surragate the file input so we may have 
       * a custom browse button.
       */
      document.getElementById('permission-file-selector').click();
    }
  }, {
    key: 'fileSelected',
    value: function fileSelected(event) {
      if (event === undefined) return;
      var fileSelector = event.target;
      var file = fileSelector.files[0];
      this.props.uploadPermissions(file);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          permissions = _props.permissions,
          projects = _props.projects,
          users = _props.users;


      var permFileSelector = {
        id: 'permission-file-selector',
        type: 'file',
        name: 'upload-file',
        onChange: this.fileSelected.bind(this)
      };

      var uploadPermBtnProps = {
        className: 'admin-add-btn',
        onClick: this.selectFile.bind(this)
      };

      var dwnldPermBtnProps = {
        className: 'admin-add-btn',
        onClick: this.props.downloadPermissions.bind(this)
      };

      var addPermBtnProps = {
        className: 'admin-add-btn',
        onClick: this.props.addPermission.bind(this)
      };

      var callbacks = {
        removeUnsavedPermission: this.props.removeUnsavedPermission,
        savePermission: this.props.savePermission,
        removePermission: this.props.removePermission
      };

      return React.createElement(
        'div',
        { className: 'admin-edit-grouping' },
        React.createElement(
          'table',
          { id: 'permission-edit-group' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              { className: 'admin-edit-head-group' },
              React.createElement(
                'th',
                { id: 'permission-user-column', className: 'admin-edit-title' },
                'user email ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'permission-project-column', className: 'admin-edit-title' },
                'project ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'permission-column', className: 'admin-edit-title' },
                'permission ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'permission-control-column', className: 'admin-edit-title' },
                React.createElement(
                  'button',
                  addPermBtnProps,
                  React.createElement('span', { className: 'glyphicon glyphicon-plus white-glyphicon' }),
                  ' ADD PERM'
                ),
                React.createElement(
                  'button',
                  dwnldPermBtnProps,
                  'DOWN'
                ),
                React.createElement(
                  'button',
                  uploadPermBtnProps,
                  React.createElement('input', permFileSelector),
                  'UP'
                )
              )
            )
          ),
          React.createElement(
            'tbody',
            { id: 'permission-edit-body-group' },
            Object.values(permissions).map(function (project) {
              return Object.values(project).map(function (permission, index) {
                var permEntryProps = _extends({
                  permission: permission,
                  projects: projects,
                  users: users
                }, callbacks, {
                  key: permission.key
                });
                return React.createElement(_permissionEntry2.default, permEntryProps);
              });
            }).reduce(function (a, b) {
              return a.concat(b);
            }, [])
          )
        )
      );
    }
  }]);

  return PermissionEdit;
}(React.Component);

exports.default = PermissionEdit;