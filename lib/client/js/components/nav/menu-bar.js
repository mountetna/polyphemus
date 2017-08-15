'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MenuBar = function (_React$Component) {
  _inherits(MenuBar, _React$Component);

  function MenuBar(props) {
    _classCallCheck(this, MenuBar);

    var _this = _possibleConstructorReturn(this, (MenuBar.__proto__ || Object.getPrototypeOf(MenuBar)).call(this, props));

    _this.state = {
      open: false
    };
    return _this;
  }

  _createClass(MenuBar, [{
    key: 'toggle',
    value: function toggle(event) {
      this.setState({ open: !this.state.open });
    }
  }, {
    key: 'closePanel',
    value: function closePanel(event) {
      this.setState({ open: false });
    }
  }, {
    key: 'logOut',
    value: function logOut(event) {
      this.setState({ open: false });
      this.props.requestLogout();
    }
  }, {
    key: 'renderUserMenu',
    value: function renderUserMenu() {
      var _props = this.props,
          error = _props.error,
          email = _props.email;


      if (!email || error) return null;

      var userDropdownGroupProps = {
        className: 'user-menu-dropdown-group',
        style: {
          height: this.state.open ? 'auto' : '100%'
        },
        onMouseLeave: this.closePanel.bind(this)
      };

      return React.createElement(
        'div',
        userDropdownGroupProps,
        React.createElement(
          'button',
          {
            className: 'user-menu-dropdown-btn',
            onClick: this.toggle.bind(this) },
          email,
          React.createElement(
            'div',
            { className: 'user-menu-arrow-group' },
            React.createElement('span', { className: 'glyphicon glyphicon-triangle-bottom' })
          )
        ),
        React.createElement(
          'div',
          { className: 'user-dropdown-menu' },
          React.createElement(
            'a',
            { href: '/user-admin', className: 'user-dropdown-menu-item' },
            'user admin'
          ),
          React.createElement(
            'div',
            {
              className: 'user-dropdown-menu-item',
              onClick: this.logOut.bind(this) },
            'log out'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'nav-menu' },
        this.renderUserMenu()
      );
    }
  }]);

  return MenuBar;
}(React.Component);

exports.default = MenuBar;