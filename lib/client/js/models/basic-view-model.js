'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var Redux = _interopRequireWildcard(_redux);

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

var _reduxLogger = require('redux-logger');

var _janusLogReducer = require('./janus-log-reducer');

var _janusLogReducer2 = _interopRequireDefault(_janusLogReducer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var createStore = function createStore(routeAction) {
  var reducer = Redux.combineReducers({
    user: _janusLogReducer2.default
  });
  var middlewares = [_reduxThunk2.default, (0, _reduxLogger.createLogger)()];
  var store = Redux.createStore(reducer, {}, Redux.applyMiddleware.apply(Redux, middlewares));
  return store;
};

exports.default = createStore;