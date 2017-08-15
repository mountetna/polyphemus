'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var ReactRedux = _interopRequireWildcard(_reactRedux);

var _userAdminView = require('./user-admin-view');

var _userAdminView2 = _interopRequireDefault(_userAdminView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapStateToProps = function mapStateToProps(state, ownProps) {

  // state == redux store
  return {

    'userInfo': state['userInfo']
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {

  return {};
};

var UserAdminViewContainer = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(_userAdminView2.default);

exports.default = UserAdminViewContainer;