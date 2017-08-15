'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GenericAdminEntry = function (_React$Component) {
  _inherits(GenericAdminEntry, _React$Component);

  function GenericAdminEntry(props) {
    _classCallCheck(this, GenericAdminEntry);

    var _this = _possibleConstructorReturn(this, (GenericAdminEntry.__proto__ || Object.getPrototypeOf(GenericAdminEntry)).call(this, props));

    _this.state = {
      editShow: false,
      editActive: false
    };
    return _this;
  }

  _createClass(GenericAdminEntry, [{
    key: 'activateEntryEdit',
    value: function activateEntryEdit() {
      this.setState({ editActive: true });
    }
  }, {
    key: 'deactivateEntryEdit',
    value: function deactivateEntryEdit() {
      this.setState({ editActive: false });
    }

    /*
     * These three items are to be overidden by the inheriting object/class, but 
     * their stubs are required here to complete this component.
     */

  }, {
    key: 'resetEntry',
    value: function resetEntry() {
      // null
    }
  }, {
    key: 'saveEntry',
    value: function saveEntry() {
      // null
    }
  }, {
    key: 'deleteEntry',
    value: function deleteEntry() {
      // null
    }
  }, {
    key: 'renderEditControlGroup',
    value: function renderEditControlGroup() {
      // General control group properties.
      var controlBoxProps = {

        className: 'admin-control-box'
      };

      var editBtnProps = {

        className: 'admin-entry-edit-btn',
        title: 'Edit the entry.',
        onClick: this.activateEntryEdit.bind(this)
      };

      var resetBtnProps = {

        className: 'admin-entry-edit-btn',
        title: 'Reset the entry.',
        onClick: this.resetEntry.bind(this)
      };

      var cancelBtnProps = {

        className: 'admin-entry-edit-btn',
        title: 'Cancel the entry edit.',
        onClick: this.deactivateEntryEdit.bind(this)
      };

      var saveBtnProps = {

        className: 'admin-entry-edit-btn',
        title: 'Save the entry edit.',
        onClick: this.saveEntry.bind(this)
      };

      var deleteBtnProps = {

        className: 'admin-entry-delete-btn',
        title: 'Delete the entry.',
        onClick: this.deleteEntry.bind(this)
      };

      // Display settings
      if (this.state.editShow) {

        controlBoxProps.style = { visibility: 'visible' };
      } else {

        controlBoxProps.style = { visibility: 'hidden' };
      }

      if (this.state.editActive) {

        editBtnProps.style = { display: 'none' };
        resetBtnProps.style = { display: 'none' };
        cancelBtnProps.style = { display: 'inline-block' };
        saveBtnProps.style = { display: 'inline-block' };
      } else {

        editBtnProps.style = { display: 'inline-block' };
        resetBtnProps.style = { display: 'inline-block' };
        cancelBtnProps.style = { display: 'none' };
        saveBtnProps.style = { display: 'none' };
      }

      return React.createElement(
        'div',
        controlBoxProps,
        React.createElement(
          'button',
          editBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-pencil' })
        ),
        React.createElement(
          'button',
          resetBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-refresh' })
        ),
        React.createElement(
          'button',
          cancelBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-remove' })
        ),
        React.createElement(
          'button',
          saveBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-ok' })
        ),
        React.createElement(
          'button',
          deleteBtnProps,
          React.createElement('span', { className: 'glyphicon glyphicon-remove-circle' })
        )
      );
    }
  }, {
    key: 'showControlGroup',
    value: function showControlGroup(event) {

      this.setState({ editShow: true });
    }
  }, {
    key: 'hideControlGroup',
    value: function hideControlGroup(event) {

      // Only hide if we are NOT in edit mode.
      if (!this.state.editActive) this.setState({ editShow: false });
    }

    // This function is overwritten by the inheriting class.

  }, {
    key: 'render',
    value: function render() {

      return React.createElement('div', null);
    }
  }]);

  return GenericAdminEntry;
}(React.Component);

exports.default = GenericAdminEntry;