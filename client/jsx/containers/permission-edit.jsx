import * as ReactRedux from 'react-redux';
import PermissionEdit from '../components/user-admin/permission-edit';
import { permissionList } from '../selectors/permission';

const mapStateToProps = (state, ownProps)=>{
  return {
    permissions: permissionList(state),
    projects: state.projects,
    users: state.users
  };
}

const mapDispatchToProps = (dispatch, ownProps)=>{
  return {
    addPermission: ()=>{
      var action = { type: 'ADD_PERMISSION' };
      dispatch(action);
    },

    savePermission: (permission)=>{
      var action = { type: 'SAVE_PERMISSION', permission };
      dispatch(action);
    },

    removeUnsavedPermission: (reactKey)=>{
      var action = { 
        type: 'REMOVE_UNSAVED_PERMISSION', 
        reactKey: reactKey 
      };
      dispatch(action);
    },

    downloadPermissions: ()=>{
      var action = { type: 'DOWNLOAD_PERMISSIONS' };
      dispatch(action);
    },

    uploadPermissions: (file)=>{
      var action = { type: 'UPLOAD_PERMISSIONS', file };
      dispatch(action);
    },

    removePermission: (permission)=>{
      var action = { type: 'REMOVE_PERMISSION', permission };
      dispatch(action);
    }
  };
}

const PermissionEditContainer = ReactRedux.connect(

  mapStateToProps,
  mapDispatchToProps,
)(PermissionEdit);

export default PermissionEditContainer;
