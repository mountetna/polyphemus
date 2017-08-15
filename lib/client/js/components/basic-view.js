'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _titleBar = require('./nav/title-bar');

var _titleBar2 = _interopRequireDefault(_titleBar);

var _menuBar = require('../containers/menu-bar');

var _menuBar2 = _interopRequireDefault(_menuBar);

var _loginPanel = require('../containers/login-panel');

var _loginPanel2 = _interopRequireDefault(_loginPanel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicView = function (_React$Component) {
  _inherits(BasicView, _React$Component);

  function BasicView() {
    _classCallCheck(this, BasicView);

    return _possibleConstructorReturn(this, (BasicView.__proto__ || Object.getPrototypeOf(BasicView)).call(this));
  }

  _createClass(BasicView, [{
    key: 'renderContent',
    value: function renderContent() {
      if (!this.props.email) {
        return _react2.default.createElement(
          'div',
          { id: 'listing-group' },
          _react2.default.createElement(_loginPanel2.default, null)
        );
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'polyphemus-group' },
        _react2.default.createElement(
          'div',
          { id: 'header-group' },
          _react2.default.createElement(_titleBar2.default, null),
          _react2.default.createElement(_menuBar2.default, null)
        ),
        _react2.default.createElement(
          'div',
          { className: 'logo-group' },
          _react2.default.createElement('img', { src: '/img/logo_basic.png', alt: '' })
        ),
        _react2.default.createElement('div', { id: 'left-column-group' }),
        _react2.default.createElement(
          'div',
          { id: 'user-info-group' },
          this.renderContent()
        )
      );
    }
  }]);

  return BasicView;
}(_react2.default.Component);

exports.default = BasicView;