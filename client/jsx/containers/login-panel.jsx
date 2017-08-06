import { connect } from 'react-redux'
import LoginPanel from '../components/auth/login-panel'
import { requestLogin } from '../actions/janus'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.userInfo
  }
}

const LoginPanelContainer = connect(
  mapStateToProps,
  {
    requestLogin
  }
)(LoginPanel)

export default LoginPanelContainer
