import * as ReactRedux from 'react-redux';
import ProjectEdit from '../components/user-admin/project-edit';

const mapStateToProps = (state, ownProps)=>{
  return {
    projects: state.projects
  };
}

const ProjectEditContainer = ReactRedux.connect(
  mapStateToProps
)(ProjectEdit);

export default ProjectEditContainer;
