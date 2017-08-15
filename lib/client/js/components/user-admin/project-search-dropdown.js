'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var ProjectSearchDropdown = function (_GenericSearchDropdow) {
  _inherits(ProjectSearchDropdown, _GenericSearchDropdow);

  function ProjectSearchDropdown(props) {
    _classCallCheck(this, ProjectSearchDropdown);

    var _this = _possibleConstructorReturn(this, (ProjectSearchDropdown.__proto__ || Object.getPrototypeOf(ProjectSearchDropdown)).call(this, props));

    _this.state = _extends({}, _this.state, {
      searchEnabled: true
    });
    return _this;
  }

  _createClass(ProjectSearchDropdown, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          value = _props.value,
          entries = _props.entries;


      var dropdownGroupProps = {
        className: 'search-dropdown-group'
      };

      var dropdownInputProps = {
        className: this.setInputClass(),
        disabled: this.setInputDisabled(),
        value: value,
        onChange: this.updateInputValue.bind(this),
        onKeyUp: this.selectByKeyboard.bind(this),
        ref: function ref(component) {
          _this2.dropdownInput = component;
        }
      };

      var dropdownBtnProps = {
        className: 'search-dropdown-btn',
        onClick: this.toggleDropdown.bind(this),
        style: this.setButtonStyle()
      };

      if (!this.props.editActive) entries = null;else if (value.length < 2) entries = ['type to search...'];else {
        // We do a simple string pattern match for entries
        entries = entries.filter(function (entry) {
          return entry.indexOf(value) != -1;
        });
        // If there are no matching entries then add a blank entry that says so.
        if (entries.length == 0) entries.push('no matching entries...');
      }

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

  return ProjectSearchDropdown;
}(_genericSearchDropdown2.default);

exports.default = ProjectSearchDropdown;