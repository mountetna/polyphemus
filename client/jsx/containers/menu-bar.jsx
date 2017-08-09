import { connect } from 'react-redux'
import MenuBar from '../components/nav/menu-bar'
import { requestLogout } from '../actions/janus'
import { currentUser } from '../selectors/user'

const mapStateToProps = (state, ownProps) => {
  return {
    ...currentUser(state),
    error: state.error
  }
}

const MenuBarContainer = connect(
  mapStateToProps,
  {
    requestLogout
  },
)(MenuBar)

export default MenuBarContainer
