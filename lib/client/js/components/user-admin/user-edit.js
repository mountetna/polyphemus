'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _userEntry = require('./user-entry');

var _userEntry2 = _interopRequireDefault(_userEntry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserEdit = function (_React$Component) {
  _inherits(UserEdit, _React$Component);

  function UserEdit() {
    _classCallCheck(this, UserEdit);

    return _possibleConstructorReturn(this, (UserEdit.__proto__ || Object.getPrototypeOf(UserEdit)).call(this));
  }

  _createClass(UserEdit, [{
    key: 'render',
    value: function render() {
      var users = this.props.users;


      return React.createElement(
        'div',
        { className: 'admin-edit-grouping' },
        React.createElement(
          'table',
          { id: 'user-edit-group' },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              { className: 'admin-edit-head-group' },
              React.createElement(
                'th',
                { id: 'user-email-column', className: 'admin-edit-title' },
                'email ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'first-name-column', className: 'admin-edit-title' },
                'first ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'last-name-column', className: 'admin-edit-title' },
                'last ',
                React.createElement(
                  'div',
                  { className: 'admin-column-head-arrow-group' },
                  React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
                )
              ),
              React.createElement(
                'th',
                { id: 'user-control-column', className: 'admin-edit-title' },
                React.createElement(
                  'button',
                  { className: 'admin-add-btn' },
                  React.createElement('span', { className: 'glyphicon glyphicon-plus white-glyphicon' }),
                  'ADD USER'
                ),
                React.createElement(
                  'button',
                  { className: 'admin-add-btn', onClick: this['props'].logoutAll },
                  React.createElement('span', { className: 'glyphicon glyphicon-lock white-glyphicon' }),
                  'LOGOUT ALL'
                )
              )
            )
          ),
          React.createElement(
            'tbody',
            { id: 'user-edit-body-group' },
            Object.values(users).map(function (user, index) {
              return React.createElement(_userEntry2.default, { user: user, key: 'user-entry-' + index });
            })
          )
        )
      );
    }
  }]);

  return UserEdit;
}(React.Component);

exports.default = UserEdit;