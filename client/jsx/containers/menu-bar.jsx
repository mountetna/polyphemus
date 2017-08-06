import { connect } from 'react-redux'
import MenuBar from '../components/nav/menu-bar'
import { logOut } from '../actions/janus'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.userInfo
  }
}

const MenuBarContainer = connect(
  mapStateToProps,
  {
    logOut
  },
)(MenuBar)

export default MenuBarContainer
