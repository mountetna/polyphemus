'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var ReactRedux = _interopRequireWildcard(_reactRedux);

var _projectEdit = require('./project-edit');

var _projectEdit2 = _interopRequireDefault(_projectEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapStateToProps = function mapStateToProps(state, ownProps) {

  // state == redux store
  return {

    adminInfo: state['adminInfo']
  };
};

var mapDispatchToProps = function mapDispatchToProps(dispatch, ownProps) {

  return {};
};

var ProjectEditContainer = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(_projectEdit2.default);

exports.default = ProjectEditContainer;