import * as React from 'react'

export default class MenuBar extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      open: false
    }
  }

  toggle(event){
    this.setState({ open: !this.state.open })
  }

  closePanel(event){
    this.setState({ open: false })
  }

  logOut(event){
    this.setState({ open: false })
    this.props.logOut()
  }

  renderUserMenu() {
    var { loginStatus, loginError, userEmail } = this.props
    
    if (!loginStatus || loginError) return null
    

    var userDropdownGroupProps = {
      className: 'user-menu-dropdown-group',
      style: {
        height: (this.state.open) ? 'auto' : '100%'
      },
      onMouseLeave: this.closePanel.bind(this)
    }

    return (
      <div { ...userDropdownGroupProps } >
        <button 
          className='user-menu-dropdown-btn'
          onClick={ this.toggle.bind(this) } >
          { userEmail }
          <div className='user-menu-arrow-group'>
            <span className='glyphicon glyphicon-triangle-bottom'></span>
          </div>
        </button>

        <div className='user-dropdown-menu'>
          <a href='/user-admin' className='user-dropdown-menu-item'>
            { 'user admin' }
          </a>

          <div 
            className='user-dropdown-menu-item' 
            onClick={ this.logOut.bind(this) }>
            { 'log out' }
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div id='nav-menu'>
        { this.renderUserMenu() }
      </div>
    )
  }
}
