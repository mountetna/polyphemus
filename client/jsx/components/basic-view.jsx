import React from 'react'
import TitleBar  from './nav/title-bar'
import MenuBar   from '../containers/menu-bar'
import LoginPanel from '../containers/login-panel'

export default class BasicView extends React.Component {
  constructor() {
    super()
  }

  renderContent() {
    if (!this.props.email) {
      return (
        <div id='listing-group'>
          <LoginPanel />
        </div>
      )
    }
  }

  render() {
    return (
      <div id='polyphemus-group'>

        <div id='header-group'>
          <TitleBar />
          <MenuBar/>
        </div>

        <div className='logo-group'>
          <img src='/img/logo_basic.png' alt='' />
        </div>

        <div id='left-column-group'/>

        <div id='user-info-group'>
        { this.renderContent() }
        </div>
      </div>
    )
  }
}
