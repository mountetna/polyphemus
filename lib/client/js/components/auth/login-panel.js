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

var LoginPanel = function (_React$Component) {
  _inherits(LoginPanel, _React$Component);

  function LoginPanel() {
    _classCallCheck(this, LoginPanel);

    var _this = _possibleConstructorReturn(this, (LoginPanel.__proto__ || Object.getPrototypeOf(LoginPanel)).call(this));

    _this.state = { email: '', password: '' };
    return _this;
  }

  _createClass(LoginPanel, [{
    key: 'runOnEnter',
    value: function runOnEnter(event) {
      if (event.keyCode != 13 && event.which != 13) return;
      this.logIn();
    }
  }, {
    key: 'logIn',
    value: function logIn() {
      var _state = this.state,
          email = _state.email,
          password = _state.password;


      if (password != '' && VALIDATE_EMAIL(email)) {
        this.props.requestLogin(email, password);
      }
    }
  }, {
    key: 'setEmail',
    value: function setEmail(event) {
      this.setState({ email: event.target.value });
    }
  }, {
    key: 'setPassword',
    value: function setPassword(event) {
      this.setState({ password: event.target.value });
    }
  }, {
    key: 'render',
    value: function render() {
      var emailInputProps = {
        id: 'email-input',
        className: 'log-input',
        type: 'text',
        placeholder: 'Enter your email',
        onChange: this.setEmail.bind(this),
        onKeyPress: this.runOnEnter.bind(this)
      };

      var passInputProps = {
        id: 'pass-input',
        className: 'log-input',
        type: 'password',
        placeholder: 'Enter your password',
        onChange: this.setPassword.bind(this),
        onKeyPress: this.runOnEnter.bind(this)
      };

      var errMsgProps = {
        className: 'log-error-message',
        style: { display: this.props.error ? 'block' : 'none' }
      };

      var logBtnProps = {
        'className': 'login-button',
        'onClick': this.logIn.bind(this)
      };

      return React.createElement(
        'div',
        { id: 'login-group' },
        React.createElement('input', emailInputProps),
        React.createElement('br', null),
        React.createElement('input', passInputProps),
        React.createElement('br', null),
        React.createElement(
          'div',
          errMsgProps,
          this.props.error
        ),
        React.createElement(
          'button',
          logBtnProps,
          'SIGN IN'
        )
      );
    }
  }]);

  return LoginPanel;
}(React.Component);

exports.default = LoginPanel;