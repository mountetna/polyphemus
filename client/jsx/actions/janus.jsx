import { postLoginEmailPassword, postCheckToken, postLogout } from '../api'
import { getToken, setToken, removeToken } from '../cookies'

export const loggedIn = (email,password) => ({
  type: 'LOGGED_IN',
  email, password
})

export const loggedOut = () => ({
  type: 'LOGGED_OUT'
})

export const verifyLogin = () => (dispatch) => {
  let token = getToken()
  if (token != undefined) {
    checkToken(token)
      .then((response) => {
        if (response.user_info) dispatch(verifyUser(response.user_info))
      })
  } else {
    attemptLogin()
  }
}

const attemptLogin = () => {
  removeToken()
  redirect_to('/login')
}

const noPermissionAlert = () => {
  let msg = `It looks like you have no permissions in our system, `
    + `which means you cannot permform any tasks in our system. `
    + `Please contact the system administrator to get some permissions.`
  alert(msg)
}

export const verifyUser = (user) => (dispatch) => {
  if (user.permissions.length == 0) {
    noPermissionAlert()
    dispatch(logOut(token))
    return
  }

  setToken(token)

  dispatch(updateUser(user))
}

export const updateUser = (user) => {
  let { email, token, first_name, last_name, user_id, permissions } = user
  return {
    type: 'LOGGED_IN',
    email,
    token,
    first_name,
    last_name,
    user_id,
    permissions
  }
}

export const requestLogin = (email, password) => (dispatch) => {
  postLoginEmailPassword(email,password)
    .then((response) => {
      if (response.user_info) dispatch(updateUser(response.user_info))
    }).catch((error) => {
      if (!error.response) throw error
    })
}

export const requestLogout = (token) => (dispatch) => {
  postLogout(token)
    .then((response) => {
      removeToken()
      dispatch(loggedOut())
    })
}
