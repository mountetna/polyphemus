import { connect } from 'react-redux'
import LoginPanel from '../components/auth/login-panel'
import { requestLogin } from '../actions/janus'
import { currentUser } from '../selectors/user'

const mapStateToProps = (state, ownProps) => {
  return {
    ...currentUser(state),
    error: state.error
  }
}

const LoginPanelContainer = connect(
  mapStateToProps,
  {
    requestLogin
  }
)(LoginPanel)

export default LoginPanelContainer
