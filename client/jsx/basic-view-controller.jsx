import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { getToken } from './cookies'
import createStore from './models/basic-view-model'
import BasicView from './containers/basic-view'
import { verifyLogin } from './actions/janus'

class BasicViewController {
  constructor() {
    this.store = createStore(this.routeAction.bind(this))
    this.buildUI()

    /*
     * We pass in the store since we bind events to it. The AJAX callbacks will
     * be dispatched using the store.
     */
    dispatch(verifyLogin())
  }

  buildUI() {
    ReactDOM.render(
      <Provider store={ this.store }>
        <BasicView/>
      </Provider>,
      document.getElementById('ui-group')
    )
  }

  routeAction(action){
    switch(action.type){
      case 'LOG_IN':
        let { email, password } = action
        this.janus.logIn(email, password)
        break

      case 'LOG_OUT':
        this.janus.logOut(getToken())
        break

      case 'LOGGED_OUT':

        //window.location = LOGGED_OUT_ADDR()
        break
      case 'NOT_LOGGED':

        //window.location = NOT_LOGGED_ADDR()
        break
      default:

        // none
        break
    }
  }
}

// Initialize the class.
var basicViewController = new BasicViewController()
