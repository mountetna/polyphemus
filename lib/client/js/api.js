'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// api.js
// Here go direct connections to endpoints using the fetch
// interface. Exported functions all return a promise or
// throw an error (used with .then() and .catch()
// respectively

// shortcut for setting headers
var headers = exports.headers = function headers() {
  for (var _len = arguments.length, types = Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  var _headers = {};

  var add = function add(header, value) {
    return _headers[header] = value;
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var type = _step.value;

      switch (type) {
        case 'json':
          add('Content-Type', 'application/json');
          break;
        case 'form':
          add('Content-Type', 'application/x-www-form-urlencoded');
          break;
        case 'csrf':
          var csrf = document.querySelector('meta[name=csrf-token]');
          if (csrf) add('X-CSRF-Token', csrf.getAttribute('content'));
          break;
      }
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

  return _headers;
};

// first responder, split between .then() and .catch() by
// using throw
var checkResponse = function checkResponse(response) {
  if (response.ok) {
    return response;
  } else {
    var Error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

// promise for a json parse of the response
var json = function json(response) {
  return response.json();
};

// promise for a json-formatted error message
var json_error = function json_error(error) {
  return error.response.json().then(function (response) {
    error.response = response;
    throw error;
  });
};

// compose a Object into a FormData object
var formBody = function formBody(terms) {
  var form = new FormData();
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = Object.keys(terms)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      form.append(key, terms[key]);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return form;
};

// compose an Object into a url-encoded string
var encodeBody = function encodeBody(terms) {
  return Object.keys(terms).reduce(function (list, key) {
    return [].concat(_toConsumableArray(list), [encodeURIComponent(key) + '=' + encodeURIComponent(terms[key])]);
  }, []).join('&');
};

// login related functions
var postLoginEmailPassword = exports.postLoginEmailPassword = function postLoginEmailPassword(email, password) {
  return postForm('/login', { email: email, password: password });
};
var postLogout = exports.postLogout = function postLogout(token) {
  return postForm('/logout', { token: token });
};
var postCheckToken = exports.postCheckToken = function postCheckToken(token) {
  return postForm('/check', { token: token });
};

// project admin related functions
var postProjects = exports.postProjects = function postProjects(token) {
  return postForm('/projects', { token: token });
};
var postPermissions = exports.postPermissions = function postPermissions(token) {
  return postForm('/permissions', { token: token });
};
var postUsers = exports.postUsers = function postUsers(token) {
  return postForm('/users', { token: token });
};
var postUploadPermissions = exports.postUploadPermissions = function postUploadPermissions(token, permissions) {
  return postJSON('/upload-permissions', { token: token, permissions: permissions });
};

var postForm = exports.postForm = function postForm(path, body) {
  return fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('form'),
    body: encodeBody(body)
  }).then(checkResponse).then(json).catch(json_error);
};

var postJSON = exports.postJSON = function postJSON(path, body) {
  return fetch(path, {
    method: 'POST',
    credentials: 'same-origin',
    headers: headers('json'),
    body: JSON.stringify(body)
  }).then(checkResponse).then(json).catch(json_error);
};