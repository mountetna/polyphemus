'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _store = require('./models/store');

var _store2 = _interopRequireDefault(_store);

var _userAdminView = require('./components/user-admin-view');

var _userAdminView2 = _interopRequireDefault(_userAdminView);

var _janus = require('./actions/janus');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UserAdminController = function () {
  function UserAdminController() {
    _classCallCheck(this, UserAdminController);

    this.store = (0, _store2.default)(this.routeAction.bind(this));

    this.buildUI();
    this.store.dispatch((0, _janus.verifyLogin)());
    this.store.dispatch((0, _janus.requestProjects)());
    this.store.dispatch((0, _janus.requestPermissions)());
    this.store.dispatch((0, _janus.requestUsers)());
  }

  _createClass(UserAdminController, [{
    key: 'buildUI',
    value: function buildUI() {

      _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: this.store },
        _react2.default.createElement(_userAdminView2.default, null)
      ), document.getElementById('ui-group'));
    }
  }, {
    key: 'routeAction',
    value: function routeAction(action) {
      switch (action['type']) {
        case 'SAVE_PERMISSION':
          this.saveSinglePermission(action['permission']);
          break;

        case 'DOWNLOAD_PERMISSIONS':

          this.downloadPermissions();
          break;
        case 'UPLOAD_PERMISSIONS':

          this.checkPermissionUpload(action['file']);
          break;
        case 'REMOVE_PERMISSION':

          var permissions = [action['permission']];
          this.removePermission(permissions);
          break;
        default:

          // none
          break;
      }
    }
  }, {
    key: 'adminDataCall',
    value: function adminDataCall(endPoint) {

      if (COOKIES.hasItem(TOKEN_NAME)) {

        //Serialize the request for POST
        var logItems = 'token=' + COOKIES.getItem(TOKEN_NAME);

        try {

          AJAX({

            'url': POLYPHEMUS_ADDR + endPoint,
            'method': 'POST',
            'sendType': 'serial',
            'returnType': 'json',
            'data': logItems,
            'success': this['adminDataResponse'].bind(this),
            'error': this['ajaxError'].bind(this)
          });
        } catch (error) {

          console.log(error);
        }
      }
    }
  }, {
    key: 'adminDataResponse',
    value: function adminDataResponse(response) {

      console.log(response);
      var action = null;
      if (response['success']) {

        if (response.hasOwnProperty('projects')) {

          action = { 'type': 'HAS_PROJECTS', 'data': response['projects'] };
        } else if (response.hasOwnProperty('permissions')) {

          action = { 'type': 'HAS_PERMISSIONS', 'data': response['permissions'] };
        } else if (response.hasOwnProperty('users')) {

          action = { 'type': 'HAS_USERS', 'data': response['users'] };
        } else {

          action = null;
        }
      }

      if (action != null) this['model']['store'].dispatch(action);
    }
  }, {
    key: 'downloadPermissions',
    value: function downloadPermissions() {

      if (COOKIES.hasItem(TOKEN_NAME)) {

        //Serialize the request for POST
        var logItems = 'token=' + COOKIES.getItem(TOKEN_NAME);

        try {

          AJAX({

            'url': POLYPHEMUS_ADDR + '/get-permissions',
            'method': 'POST',
            'sendType': 'serial',
            'returnType': 'json',
            'data': logItems,
            'success': this['downloadPermsResponse'].bind(this),
            'error': this['ajaxError'].bind(this)
          });
        } catch (error) {

          //console.log(error);
        }
      }
    }
  }, {
    key: 'downloadPermsResponse',
    value: function downloadPermsResponse(response) {

      var object = response['permissions'];
      for (var index in object) {

        for (var key in object[index]) {

          object[index][CAMEL_CASE_IT(key)] = object[index][key];
          if (key.indexOf('_') != -1) delete object[index][key];
        }
      }
      response['permissions'] = object;

      var json = JSON.stringify(response['permissions'], null, 2);
      var data = 'data:text/json;charset=utf-8,' + encodeURIComponent(json);
      var downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', data);
      downloadAnchor.setAttribute('download', 'permissions.json');
      downloadAnchor.click();
    }
  }, {
    key: 'checkPermissionUpload',
    value: function checkPermissionUpload(file) {

      var reader = new FileReader();
      var self = this;

      reader.onload = function (progressEvent) {

        try {

          var permissions = JSON.parse(this.result);
          if (!self.verifyPermissionUpload(permissions)) {

            alert('Your permission file is malformed.');
            return;
          }

          self.uploadPermission(permissions);
        } catch (error) {

          alert('The file you are attempting to upload is not valid JSON.');
        }
      };

      reader.readAsText(file);
    }
  }, {
    key: 'verifyPermissionUpload',
    value: function verifyPermissionUpload(permissions) {

      var permsValid = true;

      var permType = Object.prototype.toString.call(permissions);
      if (permType != '[object Array]') permsValid = false;

      var keys = ['projectName', 'role', 'userEmail'];
      for (var a = 0; a < permissions['length']; ++a) {

        keys.forEach(function (item) {

          if (!(item in permissions[a])) permsValid = false;
        });
      }

      return permsValid;
    }
  }, {
    key: 'uploadPermission',
    value: function uploadPermission(permissions) {
      if (COOKIES.hasItem(TOKEN_NAME)) {
        //Serialize the request for POST
        var permissionItems = 'token=' + COOKIES.getItem(TOKEN_NAME);
        var encodedPerms = this.normalizePermission(permissions);
        permissionItems += '&permissions=' + encodedPerms;
        try {
          AJAX({
            'url': POLYPHEMUS_ADDR + '/upload-permissions',
            'method': 'POST',
            'sendType': 'serial',
            'returnType': 'json',
            'data': permissionItems,
            'success': this['permissionsModified'].bind(this),
            'error': this['ajaxError'].bind(this)
          });
        } catch (error) {

          //console.log(error);
        }
      }
    }
  }, {
    key: 'removePermission',
    value: function removePermission(permissions) {

      if (COOKIES.hasItem(TOKEN_NAME)) {

        //Serialize the request for POST
        var permissionItems = 'token=' + COOKIES.getItem(TOKEN_NAME);
        var encodedPerms = this.normalizePermission(permissions);
        permissionItems += '&permissions=' + encodedPerms;

        try {

          AJAX({

            'url': POLYPHEMUS_ADDR + '/remove-permissions',
            'method': 'POST',
            'sendType': 'serial',
            'returnType': 'json',
            'data': permissionItems,
            'success': this['permissionsModified'].bind(this),
            'error': this['ajaxError'].bind(this)
          });
        } catch (error) {

          //console.log(error);
        }
      }
    }
  }, {
    key: 'permissionsModified',
    value: function permissionsModified(response) {

      this.adminDataCall('/get-permissions');
    }
  }, {
    key: 'normalizePermission',
    value: function normalizePermission(permissions) {
      for (var index in permissions) {
        var permission = {};
        for (var key in permissions[index]) {
          permission[SNAKE_CASE_IT(key)] = permissions[index][key];
        }
        permissions[index] = permission;
      }
      return encodeURIComponent(JSON.stringify(permissions));
    }

    /*
     * Here, we make a simple client side check to see if the user and project
     * exisit. We also make this check on the server, but this helps cut down on 
     * unnecessary AJAX calls.
     */

  }, {
    key: 'checkSinglePermission',
    value: function checkSinglePermission(permission) {

      var adminInfo = this['model']['store'].getState()['adminInfo'];

      var users = adminInfo['users'];
      var userExists = false;
      for (var a = 0; a < users['length']; ++a) {

        if (users[a]['email'] == permission['userEmail']) {

          userExists = true;
        }
      }

      if (!userExists) {

        alert("The user specified was not found in the system.");
        return false;
      }

      var projects = adminInfo['projects'];
      var projectExists = false;
      for (var b = 0; b < projects['length']; ++b) {

        if (projects[b]['projectName'] == permission['projectName']) {

          projectExists = true;
        }
      }

      if (!projectExists) {

        alert("The project specified was not found in the system.");
        return false;
      }

      return true;
    }
  }, {
    key: 'saveSinglePermission',
    value: function saveSinglePermission(permission) {
      if (!this.checkSinglePermission(permission)) return;
      /*
       * By wrapping the permission in an array we can send it along as a bulk
       * upload...but this 'bulk upload' has only one entry.
       */
      permission = [permission];
      this.uploadPermission(permission);
    }
  }, {
    key: 'logoutAll',
    value: function logoutAll() {

      var msg1 = 'Are you sure you want to log out all the system users?';
      if (!confirm(msg1)) return;

      var msg2 = 'This action could have a negative impact on the system. \
    Are you really sure?';
      if (!confirm(msg2)) return;

      if (COOKIES.hasItem(TOKEN_NAME)) {

        //Serialize the request for POST
        var token = 'token=' + COOKIES.getItem(TOKEN_NAME);
        try {

          AJAX({

            'url': POLYPHEMUS_ADDR + '/logout-all',
            'method': 'POST',
            'sendType': 'serial',
            'returnType': 'json',
            'data': token,
            'success': function success() {
              window.location = '/';
            },
            'error': this['ajaxError'].bind(this)
          });
        } catch (error) {

          window.location = '/';
        }
      }
    }
  }, {
    key: 'ajaxError',
    value: function ajaxError(xhr, config, error) {

      console.log(xhr, config, error);
    }
  }]);

  return UserAdminController;
}();

// Initilize the class.


var userAdminController = new UserAdminController();