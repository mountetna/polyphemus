import * as React from 'react'

export default class LoginPanel extends React.Component {
  constructor() {
    super()
    this.state = { email: '', password: '' }
  }

  runOnEnter(event) {
    if (event.keyCode != 13 && event.which != 13) return
    this.logIn()
  }

  logIn() {
    let { email, password } = this.state

    if (password != '' && VALIDATE_EMAIL(email)) {
      this.props.requestLogin(email, password)
    }
  }

  setEmail(event) {
    this.setState( { email: event.target.value } )
  }
  
  setPassword(event) {
    this.setState( { password: event.target.value } )
  }

  render(){
    var emailInputProps = {
      id: 'email-input',
      className: 'log-input',
      type: 'text',
      placeholder: 'Enter your email',
      onChange: this.setEmail.bind(this),
      onKeyPress: this.runOnEnter.bind(this)
    }

    var passInputProps = {
      id: 'pass-input',
      className: 'log-input',
      type: 'password',
      placeholder: 'Enter your password',
      onChange: this.setPassword.bind(this),
      onKeyPress: this.runOnEnter.bind(this)
    }

    var errMsgProps = {
      className: 'log-error-message',
      style: { display: this.props.loginError ? 'block' : 'none' }
    }

    var logBtnProps = {
      'className': 'login-button',
      'onClick': this.logIn.bind(this)
    }

    return (
      <div id='login-group'>
        <input { ...emailInputProps }/>
        <br />
        <input { ...passInputProps } />
        <br />
        <div { ...errMsgProps }>
          { this.props.loginErrorMsg }
        </div>
        <button { ...logBtnProps }>
          SIGN IN
        </button>
      </div>
    )
  }
}
