'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var UserEntry = function (_GenericAdminEntry) {
  _inherits(UserEntry, _GenericAdminEntry);

  function UserEntry() {
    _classCallCheck(this, UserEntry);

    return _possibleConstructorReturn(this, (UserEntry.__proto__ || Object.getPrototypeOf(UserEntry)).apply(this, arguments));
  }

  _createClass(UserEntry, [{
    key: 'render',
    value: function render() {
      var _ref = this.props.user || {},
          email = _ref.email,
          first_name = _ref.first_name,
          last_name = _ref.last_name;

      var adminEntryProps = {
        'className': 'admin-edit-entry-group',
        'onMouseEnter': this['showControlGroup'].bind(this),
        'onMouseLeave': this['hideControlGroup'].bind(this)
      };

      var emailEntryProps = {
        'className': 'admin-entry-input',
        'value': email,
        'title': email
      };

      var firstNameEntryProps = {
        'className': 'admin-entry-input',
        'value': first_name,
        'title': first_name
      };

      var lastNameEntryProps = {
        'className': 'admin-entry-input',
        'value': last_name,
        'title': last_name
      };

      if (!this['state']['editActive']) {

        emailEntryProps['className'] = 'admin-entry-input-inactive';
        emailEntryProps['disabled'] = true;

        firstNameEntryProps['className'] = 'admin-entry-input-inactive';
        firstNameEntryProps['disabled'] = true;

        lastNameEntryProps['className'] = 'admin-entry-input-inactive';
        lastNameEntryProps['disabled'] = true;
      }

      return React.createElement(
        'tr',
        adminEntryProps,
        React.createElement(
          'td',
          null,
          React.createElement('input', emailEntryProps)
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', firstNameEntryProps)
        ),
        React.createElement(
          'td',
          null,
          React.createElement('input', lastNameEntryProps)
        ),
        React.createElement(
          'td',
          null,
          this.renderEditControlGroup()
        )
      );
    }
  }]);

  return UserEntry;
}(_genericAdminEntry2.default);

exports.default = UserEntry;