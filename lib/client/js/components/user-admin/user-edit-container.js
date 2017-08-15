'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var ReactRedux = _interopRequireWildcard(_reactRedux);

var _userEdit = require('./user-edit');

var _userEdit2 = _interopRequireDefault(_userEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapStateToProps = function mapStateToProps(state, ownProps) {

  // state == redux store
  return {

    'adminInfo': state['adminInfo']
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {

  return {

    'logoutAll': function logoutAll() {

      var action = { 'type': 'LOGOUT_ALL' };
      dispatch(action);
    }
  };
};

var UserEditContainer = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(_userEdit2.default);

exports.default = UserEditContainer;