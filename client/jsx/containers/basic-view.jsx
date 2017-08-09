import { connect } from 'react-redux'
import { currentUser } from '../selectors/user'
import BasicView from '../components/basic-view'

const BasicViewContainer = connect(
  (state, props) => ({
    ...currentUser(state)
  })
)(BasicView)

export default BasicViewContainer
