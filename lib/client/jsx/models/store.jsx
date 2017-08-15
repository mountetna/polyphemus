import * as Redux from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import users from './users-reducer'
import login from './login-reducer'
import projects from './projects-reducer'
import permissions from './permissions-reducer'

const createStore = () => {
  let reducer = Redux.combineReducers({
    users,
    login,
    projects,
    permissions
  })
  let middlewares = [
    thunk,
    createLogger()
  ]
  let store = Redux.createStore(reducer, {}, Redux.applyMiddleware(...middlewares))
  return store
}

export default createStore
