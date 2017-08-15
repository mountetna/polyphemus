'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _reactRedux = require('react-redux');

var _user = require('../selectors/user');

var _basicView = require('../components/basic-view');

var _basicView2 = _interopRequireDefault(_basicView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicViewContainer = (0, _reactRedux.connect)(function (state, props) {
  return _extends({}, (0, _user.currentUser)(state));
})(_basicView2.default);

exports.default = BasicViewContainer;