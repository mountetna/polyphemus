'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var Redux = _interopRequireWildcard(_redux);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _usersReducer = require('./users-reducer');

var _usersReducer2 = _interopRequireDefault(_usersReducer);

var _loginReducer = require('./login-reducer');

var _loginReducer2 = _interopRequireDefault(_loginReducer);

var _projectsReducer = require('./projects-reducer');

var _projectsReducer2 = _interopRequireDefault(_projectsReducer);

var _permissionsReducer = require('./permissions-reducer');

var _permissionsReducer2 = _interopRequireDefault(_permissionsReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createStore = function createStore() {
  var reducer = Redux.combineReducers({
    users: _usersReducer2.default,
    login: _loginReducer2.default,
    projects: _projectsReducer2.default,
    permissions: _permissionsReducer2.default
  });
  var middlewares = [_reduxThunk2.default, (0, _reduxLogger.createLogger)()];
  var store = Redux.createStore(reducer, {}, Redux.applyMiddleware.apply(Redux, middlewares));
  return store;
};

exports.default = createStore;