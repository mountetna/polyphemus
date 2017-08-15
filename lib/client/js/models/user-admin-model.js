'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var Redux = _interopRequireWildcard(_redux);

var _userAdminReducer = require('./user-admin-reducer');

var _userAdminReducer2 = _interopRequireDefault(_userAdminReducer);

var _janusLogReducer = require('./janus-log-reducer');

var _janusLogReducer2 = _interopRequireDefault(_janusLogReducer);

var _lastActionReducer = require('./last-action-reducer');

var _lastActionReducer2 = _interopRequireDefault(_lastActionReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserAdminInfo = function UserAdminInfo() {
  _classCallCheck(this, UserAdminInfo);

  var userAdminReducer = new _userAdminReducer2.default();
  var janusLogReducer = new _janusLogReducer2.default();
  var lastAction = new _lastActionReducer2.default();
  var reducer = Redux.combineReducers({

    'adminInfo': userAdminReducer.reducer(),
    'userInfo': janusLogReducer.reducer(),
    'lastAction': lastAction.reducer()
  });

  var defaultState = {

    'adminInfo': {

      'users': [],
      'projects': [],
      'permissions': [] // These are all the permissions in the system.
    },

    'userInfo': {

      'userEmail': '',
      'authToken': '',
      'firstName': '',
      'lastName': '',
      'permissions': [], // These are the permissions for the logged user.

      'masterPerms': false,

      'loginStatus': false,
      'loginError': false,
      'loginErrorMsg': 'Invalid sign in.'
    }
  };

  this.store = Redux.createStore(reducer, defaultState);
};

exports.default = UserAdminInfo;