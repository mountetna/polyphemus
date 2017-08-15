import { postLoginEmailPassword, postCheckToken, postLogout } from '../api'
import { postProjects, postPermissions, postUsers } from '../api'
import { postUploadPermissions } from '../api'
import { getToken, removeToken } from '../cookies'

export const loggedIn = (user) => {
  let { email } = user
  return {
    type: 'LOGGED_IN',
    email
  }
}

export const loggedOut = () => {
  removeToken()
  return { type: 'LOGGED_OUT' }
}

export const logError = (msg) => ({
  type: 'LOG_ERROR',
  error: msg
})

export const verifyLogin = (success,error) => (dispatch) => {
  let token = getToken()
  if (token != undefined) {
    postCheckToken(token)
      .then((response) => {
        if (response.user_info) dispatch(verifyUser(response.user_info))
      }).catch(() => {
        dispatch(loggedOut())
        dispatch(logError('Invalid sign in.'))
      })
  } else {
    dispatch(loggedOut())
  }
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
    dispatch(loggedOut())
    return
  }

  dispatch(addUser(user))
  dispatch(loggedIn(user))
}

export const requestLogin = (email, password) => (dispatch) => {
  postLoginEmailPassword(email,password)
    .then((response) => {
      if (response.success) {
        dispatch(verifyUser(response.user_info))
      } else
        dispatch(logError(response.error))
    }).catch((error) => {
      if (!error.response) throw error
    })
}

export const requestLogout = () => (dispatch) => {
  postLogout(getToken())
    .then((response) => {
      removeToken()
      dispatch(loggedOut())
    })
}

const requestData = (post, resolve, key) => (dispatch) => {
  post(getToken())
    .then((response) => {
      if (response.success) {
        for (let value of response[key]) dispatch(resolve(value))
      }
    })
}

export const addProject = (project) => ({ type: 'ADD_PROJECT', ...project })
export const addPermission = (permission) => ({ type: 'ADD_PERMISSION', ...permission })
export const addUser = (user) => ({ type: 'ADD_USER', ...user })

export const requestProjects = () => requestData(postProjects, addProject, 'projects')
export const requestPermissions = () => requestData(postPermissions, addPermission, 'permissions')
export const requestUsers = () => requestData(postUsers, addUser, 'users')

export const savePermission = (permission) => savePermissions([permission])
  
export const savePermissions = (permissions) => (dispatch) => {
  postUploadPermissions(getToken(), permissions).then(
    (response) => permissions.forEach(permission=> dispatch(addPermission(permission)))
  )
}
