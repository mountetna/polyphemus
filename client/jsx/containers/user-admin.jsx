import * as ReactRedux from 'react-redux';
import UserAdminView from '../components/user-admin-view';

const mapStateToProps = (state, ownProps)=>{
  return {
    user: state.user
  }
}

const UserAdminViewContainer = ReactRedux.connect(
  mapStateToProps
)(UserAdminView)

export default UserAdminViewContainer
