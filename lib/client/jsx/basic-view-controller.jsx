import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { getToken } from './cookies'
import createStore from './models/store'
import BasicView from './containers/basic-view'
import { verifyLogin } from './actions/janus'

class BasicViewController {
  constructor() {
    this.store = createStore()
    this.buildUI()

    /*
     * We pass in the store since we bind events to it. The AJAX callbacks will
     * be dispatched using the store.
     */
    this.store.dispatch(verifyLogin())
  }

  buildUI() {
    ReactDOM.render(
      <Provider store={ this.store }>
        <BasicView/>
      </Provider>,
      document.getElementById('ui-group')
    )
  }
}

// Initialize the class.
var basicViewController = new BasicViewController()
