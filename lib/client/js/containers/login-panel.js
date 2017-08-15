'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRedux = require('react-redux');

var _loginPanel = require('../components/auth/login-panel');

var _loginPanel2 = _interopRequireDefault(_loginPanel);

var _janus = require('../actions/janus');

var _user = require('../selectors/user');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return _extends({}, (0, _user.currentUser)(state), {
    error: state.error
  });
};

var LoginPanelContainer = (0, _reactRedux.connect)(mapStateToProps, {
  requestLogin: _janus.requestLogin
})(_loginPanel2.default);

exports.default = LoginPanelContainer;