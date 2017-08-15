'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericSearchDropdown = function (_React$Component) {
  _inherits(GenericSearchDropdown, _React$Component);

  function GenericSearchDropdown(props) {
    _classCallCheck(this, GenericSearchDropdown);

    var _this = _possibleConstructorReturn(this, (GenericSearchDropdown.__proto__ || Object.getPrototypeOf(GenericSearchDropdown)).call(this, props));

    _this.state = {
      trayActive: false,
      searchEnabled: false,
      selectedIndex: null
    };
    return _this;
  }

  _createClass(GenericSearchDropdown, [{
    key: 'setInputClass',
    value: function setInputClass() {
      var className = 'search-dropdown-input';
      if (this.props.editActive) {
        className = 'search-dropdown-input';

        if (this.state.trayActive) {
          className = 'search-dropdown-input search-dropdown-input-active';
        } else {
          className = 'search-dropdown-input';
        }
      } else {
        className = 'search-dropdown-input-inactive';
      }

      return className;
    }
  }, {
    key: 'setInputDisabled',
    value: function setInputDisabled() {
      return !this.props.editActive || !this.state.searchEnabled;
    }
  }, {
    key: 'setButtonStyle',
    value: function setButtonStyle() {
      return { display: this.props.editActive ? 'block' : 'none' };
    }
  }, {
    key: 'setDropdownStyle',
    value: function setDropdownStyle() {
      return {
        display: this.state.trayActive ? 'block' : 'none',
        zIndex: this.state.trayActive ? 10000 : 0
      };
    }
  }, {
    key: 'entrySelectedByClick',
    value: function entrySelectedByClick(event) {
      var _this2 = this;

      var inputValue = event.target.getAttribute('data-val');
      this.setState({
        trayActive: false,
        selectedIndex: null
      }, function () {
        return _this2.props.onChange(inputValue);
      });

      if (this.dropdownInput == undefined) return;
      this.dropdownInput.focus();
    }
  }, {
    key: 'entrySelectedByEnter',
    value: function entrySelectedByEnter(inputValue) {
      var _this3 = this;

      this.setState({
        trayActive: false,
        selectedIndex: null
      }, function () {
        return _this3.props.onChange(inputValue);
      });

      if (this.dropdownInput == undefined) return;
      this.dropdownInput.focus();
    }
  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown(event) {
      this.setState({ trayActive: !this.state.trayActive });
    }
  }, {
    key: 'openDropdownFromClick',
    value: function openDropdownFromClick(event) {
      if (!this.state.searchEnabled) {
        this.toggleDropdown(event);
      }
    }
  }, {
    key: 'updateInputValue',
    value: function updateInputValue(event) {
      var inputValue = event.target.value;
      var state = _extends({}, this.state.searchEnabled && { trayActive: inputValue.length >= 2 });
      this.setState(state);
      this.props.onChange(inputValue);
    }
  }, {
    key: 'selectByKeyboard',
    value: function selectByKeyboard(event) {
      if (this.dropdownTrayComponent == undefined) return;
      if (!this.state.trayActive) return;
      if (!this.state.selectedIndex == null) return;

      event = event || window.event;
      var range = this.dropdownTrayComponent.childNodes.length;
      var index = this.state.selectedIndex;

      // Navigate the dropdown list using the arrow keys.
      if (event.keyCode == 38 || event.keyCode == 40) {
        if (event.keyCode == 38) {
          if (index == 0 || index == null) {
            index = range - 1;
          } else {
            --index;
          }
        }

        if (event.keyCode == 40) {
          if (index == range - 1 || index == null) {
            index = 0;
          } else {
            ++index;
          }
        }

        this.setState({ selectedIndex: index });
      }

      // Select the entry using the 'enter' key.
      if (event.keyCode == 13) {
        var node = this.dropdownTrayComponent.childNodes[index];
        var val = node.getAttribute('data-val');
        this.entrySelectedByEnter(val);
      }
    }
  }, {
    key: 'renderEntry',
    value: function renderEntry(entry, index, selected) {
      var entryProps = {
        className: selected ? 'search-dropdown-tray-entry-active' : 'search-dropdown-tray-entry',
        key: entry + '-' + index,
        'data-val': entry,
        onClick: this.entrySelectedByClick.bind(this)
      };

      return React.createElement(
        'button',
        entryProps,
        entry
      );
    }
  }, {
    key: 'renderEntries',
    value: function renderEntries(entries) {
      var _this4 = this;

      if (!entries || entries.length == 0) return null;

      var dropdownTrayProps = {
        className: 'search-dropdown-tray',
        style: this.setDropdownStyle()
      };

      // Generate a list of  entries to display in the dropdown.
      return React.createElement(
        'div',
        dropdownTrayProps,
        entries.map(function (entry, index) {
          return _this4.renderEntry(entry, index, index == _this4.state.selectedIndex);
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement('div', null);
    }
  }]);

  return GenericSearchDropdown;
}(React.Component);

exports.default = GenericSearchDropdown;