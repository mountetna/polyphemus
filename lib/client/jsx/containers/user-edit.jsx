import * as ReactRedux from 'react-redux';
import UserEdit from '../components/user-admin/user-edit'

const mapStateToProps = (state, ownProps)=>{
  return {
    users: state.users
  };
}

const mapDispatchToProps = (dispatch, ownProps)=>{

  return {

    'logoutAll': ()=>{

      var action = { 'type': 'LOGOUT_ALL' };
      dispatch(action);
    }
  }
}

const UserEditContainer = ReactRedux.connect(

  mapStateToProps,
  mapDispatchToProps,
)(UserEdit);

export default UserEditContainer;
