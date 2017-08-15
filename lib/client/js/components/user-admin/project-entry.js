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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ProjectEntry = function (_GenericAdminEntry) {
  _inherits(ProjectEntry, _GenericAdminEntry);

  function ProjectEntry() {
    _classCallCheck(this, ProjectEntry);

    return _possibleConstructorReturn(this, (ProjectEntry.__proto__ || Object.getPrototypeOf(ProjectEntry)).apply(this, arguments));
  }

  _createClass(ProjectEntry, [{
    key: 'render',
    value: function render() {
      var _props$project = this.props.project,
          project_name = _props$project.project_name,
          group_name = _props$project.group_name;


      var adminEntryProps = {
        className: 'admin-edit-entry-group',
        onMouseEnter: this.showControlGroup.bind(this),
        onMouseLeave: this.hideControlGroup.bind(this)
      };

      var projectNameProps = _extends({
        className: 'admin-entry-input',
        value: project_name,
        title: project_name
      }, !this.state.editActive && { disabled: true, className: 'admin-entry-input-inactive' });

      var groupNameProps = _extends({
        className: 'admin-entry-input',
        value: group_name,
        title: group_name
      }, !this.state.editActive && { disabled: true, className: 'admin-entry-input-inactive' });

      return React.createElement(
        'tr',
        adminEntryProps,
        React.createElement(
          'td',
          null,
          React.createElement('input', projectNameProps)
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', groupNameProps)
        ),
        React.createElement(
          'td',
          null,
          this.renderEditControlGroup()
        )
      );
    }
  }]);

  return ProjectEntry;
}(_genericAdminEntry2.default);

exports.default = ProjectEntry;