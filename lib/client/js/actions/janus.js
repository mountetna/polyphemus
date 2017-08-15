'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.savePermissions = exports.savePermission = exports.requestUsers = exports.requestPermissions = exports.requestProjects = exports.addUser = exports.addPermission = exports.addProject = exports.requestLogout = exports.requestLogin = exports.verifyUser = exports.verifyLogin = exports.logError = exports.loggedOut = exports.loggedIn = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _api = require('../api');

var _cookies = require('../cookies');

var loggedIn = exports.loggedIn = function loggedIn(user) {
  var email = user.email;

  return {
    type: 'LOGGED_IN',
    email: email
  };
};

var loggedOut = exports.loggedOut = function loggedOut() {
  (0, _cookies.removeToken)();
  return { type: 'LOGGED_OUT' };
};

var logError = exports.logError = function logError(msg) {
  return {
    type: 'LOG_ERROR',
    error: msg
  };
};

var verifyLogin = exports.verifyLogin = function verifyLogin(success, error) {
  return function (dispatch) {
    var token = (0, _cookies.getToken)();
    if (token != undefined) {
      (0, _api.postCheckToken)(token).then(function (response) {
        if (response.user_info) dispatch(verifyUser(response.user_info));
      }).catch(function () {
        dispatch(loggedOut());
        dispatch(logError('Invalid sign in.'));
      });
    } else {
      dispatch(loggedOut());
    }
  };
};

var noPermissionAlert = function noPermissionAlert() {
  var msg = 'It looks like you have no permissions in our system, ' + 'which means you cannot permform any tasks in our system. ' + 'Please contact the system administrator to get some permissions.';
  alert(msg);
};

var verifyUser = exports.verifyUser = function verifyUser(user) {
  return function (dispatch) {
    if (user.permissions.length == 0) {
      noPermissionAlert();
      dispatch(loggedOut());
      return;
    }

    dispatch(addUser(user));
    dispatch(loggedIn(user));
  };
};

var requestLogin = exports.requestLogin = function requestLogin(email, password) {
  return function (dispatch) {
    (0, _api.postLoginEmailPassword)(email, password).then(function (response) {
      if (response.success) {
        dispatch(verifyUser(response.user_info));
      } else dispatch(logError(response.error));
    }).catch(function (error) {
      if (!error.response) throw error;
    });
  };
};

var requestLogout = exports.requestLogout = function requestLogout() {
  return function (dispatch) {
    (0, _api.postLogout)((0, _cookies.getToken)()).then(function (response) {
      (0, _cookies.removeToken)();
      dispatch(loggedOut());
    });
  };
};

var requestData = function requestData(post, resolve, key) {
  return function (dispatch) {
    post((0, _cookies.getToken)()).then(function (response) {
      if (response.success) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = response[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var value = _step.value;
            dispatch(resolve(value));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    });
  };
};

var addProject = exports.addProject = function addProject(project) {
  return _extends({ type: 'ADD_PROJECT' }, project);
};
var addPermission = exports.addPermission = function addPermission(permission) {
  return _extends({ type: 'ADD_PERMISSION' }, permission);
};
var addUser = exports.addUser = function addUser(user) {
  return _extends({ type: 'ADD_USER' }, user);
};

var requestProjects = exports.requestProjects = function requestProjects() {
  return requestData(_api.postProjects, addProject, 'projects');
};
var requestPermissions = exports.requestPermissions = function requestPermissions() {
  return requestData(_api.postPermissions, addPermission, 'permissions');
};
var requestUsers = exports.requestUsers = function requestUsers() {
  return requestData(_api.postUsers, addUser, 'users');
};

var savePermission = exports.savePermission = function savePermission(permission) {
  return savePermissions([permission]);
};

var savePermissions = exports.savePermissions = function savePermissions(permissions) {
  return function (dispatch) {
    (0, _api.postUploadPermissions)((0, _cookies.getToken)(), permissions).then(function (response) {
      return permissions.forEach(function (permission) {
        return dispatch(addPermission(permission));
      });
    });
  };
};