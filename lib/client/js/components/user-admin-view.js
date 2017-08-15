'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _titleBar = require('./nav/title-bar');

var _titleBar2 = _interopRequireDefault(_titleBar);

var _menuBar = require('../containers/menu-bar');

var _menuBar2 = _interopRequireDefault(_menuBar);

var _userEdit = require('../containers/user-edit');

var _userEdit2 = _interopRequireDefault(_userEdit);

var _projectEdit = require('../containers/project-edit');

var _projectEdit2 = _interopRequireDefault(_projectEdit);

var _permissionEdit = require('../containers/permission-edit');

var _permissionEdit2 = _interopRequireDefault(_permissionEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserAdminView = function (_React$Component) {
  _inherits(UserAdminView, _React$Component);

  function UserAdminView() {
    _classCallCheck(this, UserAdminView);

    return _possibleConstructorReturn(this, (UserAdminView.__proto__ || Object.getPrototypeOf(UserAdminView)).call(this));
  }

  _createClass(UserAdminView, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'admin-group' },
        React.createElement(
          'div',
          { id: 'header-group' },
          React.createElement(_titleBar2.default, null),
          React.createElement(_menuBar2.default, null)
        ),
        React.createElement(
          'div',
          { className: 'logo-group' },
          React.createElement('img', { src: '/img/logo_basic.png', alt: '' })
        ),
        React.createElement('div', { id: 'left-column-group' }),
        React.createElement(_userEdit2.default, null),
        React.createElement(_projectEdit2.default, null),
        React.createElement(_permissionEdit2.default, null)
      );
    }
  }]);

  return UserAdminView;
}(React.Component);

exports.default = UserAdminView;