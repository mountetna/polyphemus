import * as Redux from 'redux'
import thunk from 'redux-thunk'

import userInfo from './janus-log-reducer'
import lastAction from './last-action-reducer'

const createStore = (routeAction) => {
  let reducer = Redux.combineReducers({
    userInfo,
    lastAction
  })
  let store = Redux.createStore(reducer, {}, Redux.applyMiddleware(thunk))
  store.subscribe( () => {
    let { lastAction } = store.getState()
    routeAction(lastAction)
  })
  return store
}

export default createStore
