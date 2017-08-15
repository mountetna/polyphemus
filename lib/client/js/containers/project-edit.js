'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var ReactRedux = _interopRequireWildcard(_reactRedux);

var _projectEdit = require('../components/user-admin/project-edit');

var _projectEdit2 = _interopRequireDefault(_projectEdit);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var mapStateToProps = function mapStateToProps(state, ownProps) {
  return {
    projects: state.projects
  };
};

var ProjectEditContainer = ReactRedux.connect(mapStateToProps)(_projectEdit2.default);

exports.default = ProjectEditContainer;