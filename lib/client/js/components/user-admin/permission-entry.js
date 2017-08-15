'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _genericAdminEntry = require('./generic-admin-entry');

var _genericAdminEntry2 = _interopRequireDefault(_genericAdminEntry);

var _projectSearchDropdown = require('./project-search-dropdown');

var _projectSearchDropdown2 = _interopRequireDefault(_projectSearchDropdown);

var _roleDropdown = require('./role-dropdown');

var _roleDropdown2 = _interopRequireDefault(_roleDropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PermissionEntry = function (_GenericAdminEntry) {
  _inherits(PermissionEntry, _GenericAdminEntry);

  function PermissionEntry(props) {
    _classCallCheck(this, PermissionEntry);

    var _this = _possibleConstructorReturn(this, (PermissionEntry.__proto__ || Object.getPrototypeOf(PermissionEntry)).call(this, props));

    _this.state = _extends({}, _this.state, {
      revisedPermission: {}
      /* if (permission.projectId == null) {
        this.setState({
          editShow: true,
          editActive: true
        });
      } */
    });return _this;
  }

  _createClass(PermissionEntry, [{
    key: 'checkForPrimary',
    value: function checkForPrimary() {
      var perm = this.props.permission;
      if (perm.role == 'administrator' && perm.projectName == "administration") {
        alert('You cannot edit the primary permission.');
        return false;
      }
      return true;
    }
  }, {
    key: 'activateEntryEdit',
    value: function activateEntryEdit() {
      if (!this.checkForPrimary()) return;
      this.setState({
        editActive: true,
        revisedPermission: _extends({}, this.props.permission)
      });
    }
  }, {
    key: 'deactivateEntryEdit',
    value: function deactivateEntryEdit() {
      this.setState({ editActive: false, revisedPermission: {} });
    }
  }, {
    key: 'resetEntry',
    value: function resetEntry() {
      this.setState({ revisedPermission: _extends({}, this.props.permission) });
      //this.forceUpdate();
    }
  }, {
    key: 'deleteEntry',
    value: function deleteEntry() {
      var permission = this.props.permission;

      if (!this.checkForPrimary()) return;
      if (this.props.permission.id == undefined) {
        var reactKey = this.props.permission.reactKey;
        this.props.removeUnsavedPermission(reactKey);
      } else {
        this.props.removePermission(this.props.permission);
      }
    }
  }, {
    key: 'saveEntry',
    value: function saveEntry() {
      if (!this.checkForPrimary()) return;
      /*
       * These are only simple validations to keep the UI tidy. There are more 
       * stringent validations higher up in the UI and definately on the server.
       */
      var _state$revisedPermiss = this.state.revisedPermission,
          user_email = _state$revisedPermiss.user_email,
          project_name = _state$revisedPermiss.project_name,
          role = _state$revisedPermiss.role;


      if (!this.validateUser(user_email)) {
        alert('Please select a valid user.');
        return;
      }

      if (!this.validateProject(project_name)) {
        alert('Please select a valid project.');
        return;
      }

      if (!this.validateRole(role)) {
        alert('Please select a permission');
        return;
      }

      var permission = { user_email: user_email, role: role, project_name: project_name };

      this.props.savePermission(permission);
    }
  }, {
    key: 'emailSelected',
    value: function emailSelected(user_email) {
      this.updatePermission('user_email', user_email);
    }
  }, {
    key: 'updatePermission',
    value: function updatePermission(name, value) {
      var revisedPermission = _extends({}, this.state.revisedPermission, _defineProperty({}, name, value));
      this.setState({ revisedPermission: revisedPermission });
    }
  }, {
    key: 'validateUser',
    value: function validateUser(email) {
      if (!VALIDATE_EMAIL(email)) return null;
      return Object.values(this.props.users).find(function (user) {
        return user.email.toLowerCase() == email;
      });
    }
  }, {
    key: 'validateProject',
    value: function validateProject(projectName) {
      return this.props.projects.hasOwnProperty(projectName);
    }
  }, {
    key: 'validateRole',
    value: function validateRole(role) {
      return role;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          permission = _props.permission,
          projects = _props.projects;
      var _state = this.state,
          revisedPermission = _state.revisedPermission,
          editActive = _state.editActive;

      var _ref = editActive ? revisedPermission : permission,
          user_email = _ref.user_email,
          project_name = _ref.project_name,
          role = _ref.role;

      if (user_email == 'john.engelhardt@bms.com') {
        console.log('Using ' + user_email + ' ' + project_name + ' ' + role);
      }

      var adminEntryProps = {
        className: 'admin-edit-entry-group',
        onMouseEnter: this.showControlGroup.bind(this),
        onMouseLeave: this.hideControlGroup.bind(this)
      };

      var userEmailEntryProps = {
        className: editActive ? 'admin-entry-input' : 'admin-entry-input-inactive',
        disabled: !editActive,
        value: user_email,
        onChange: function onChange(e) {
          return _this2.updatePermission('user_email', e.target.value);
        },
        ref: function ref(input) {
          _this2.userEmailInput = input;
        }
      };

      var projectDropdownProps = {
        value: project_name,
        entries: Object.values(projects).map(function (p) {
          return p.project_name;
        }),
        editActive: editActive,
        onChange: this.updatePermission.bind(this, 'project_name')
      };

      var roleDropdownProps = {
        value: role,
        entries: ['administrator', 'editor', 'viewer'],
        editActive: editActive,
        onChange: this.updatePermission.bind(this, 'role')
      };

      return React.createElement(
        'tr',
        adminEntryProps,
        React.createElement(
          'td',
          null,
          React.createElement('input', userEmailEntryProps)
        ),
        React.createElement(
          'td',
          null,
          React.createElement(_projectSearchDropdown2.default, projectDropdownProps)
        ),
        React.createElement(
          'td',
          null,
          React.createElement(_roleDropdown2.default, roleDropdownProps)
        ),
        React.createElement(
          'td',
          null,
          this.renderEditControlGroup()
        )
      );
    }
  }]);

  return PermissionEntry;
}(_genericAdminEntry2.default);

exports.default = PermissionEntry;