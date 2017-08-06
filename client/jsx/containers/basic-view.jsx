import { connect } from 'react-redux'
import BasicView from '../components/basic-view'

const BasicViewContainer = connect(
  (state, props) => ({
    ...state.userInfo
  })
)(BasicView)

export default BasicViewContainer
