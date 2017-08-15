'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _genericSearchDropdown = require('../generic/generic-search-dropdown');

var _genericSearchDropdown2 = _interopRequireDefault(_genericSearchDropdown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RoleDropdown = function (_GenericSearchDropdow) {
  _inherits(RoleDropdown, _GenericSearchDropdow);

  function RoleDropdown() {
    _classCallCheck(this, RoleDropdown);

    return _possibleConstructorReturn(this, (RoleDropdown.__proto__ || Object.getPrototypeOf(RoleDropdown)).apply(this, arguments));
  }

  _createClass(RoleDropdown, [{
    key: 'render',
    value: function render() {
      // Return the input value to the parent.
      var value = this.props.value;


      var dropdownGroupProps = {
        className: 'search-dropdown-group',
        onClick: this.openDropdownFromClick.bind(this)
      };

      var dropdownInputProps = {
        className: this.setInputClass(),
        disabled: this.setInputDisabled(),
        value: value
      };

      var dropdownBtnProps = {
        className: 'search-dropdown-btn',
        onClick: this.toggleDropdown.bind(this),
        style: this.setButtonStyle()
      };

      var entries = this.props.editActive ? this.props.entries : null;

      return React.createElement(
        'div',
        dropdownGroupProps,
        React.createElement('input', dropdownInputProps),
        React.createElement(
          'button',
          dropdownBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
        ),
        this.renderEntries(entries)
      );
    }
  }]);

  return RoleDropdown;
}(_genericSearchDropdown2.default);

exports.default = RoleDropdown;