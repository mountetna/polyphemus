'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _cookies = require('./cookies');

var _store = require('./models/store');

var _store2 = _interopRequireDefault(_store);

var _basicView = require('./containers/basic-view');

var _basicView2 = _interopRequireDefault(_basicView);

var _janus = require('./actions/janus');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BasicViewController = function () {
  function BasicViewController() {
    _classCallCheck(this, BasicViewController);

    this.store = (0, _store2.default)();
    this.buildUI();

    /*
     * We pass in the store since we bind events to it. The AJAX callbacks will
     * be dispatched using the store.
     */
    this.store.dispatch((0, _janus.verifyLogin)());
  }

  _createClass(BasicViewController, [{
    key: 'buildUI',
    value: function buildUI() {
      _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: this.store },
        _react2.default.createElement(_basicView2.default, null)
      ), document.getElementById('ui-group'));
    }
  }]);

  return BasicViewController;
}();

// Initialize the class.


var basicViewController = new BasicViewController();