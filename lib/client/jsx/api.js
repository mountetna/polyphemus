// api.js
// Here go direct connections to endpoints using the fetch
// interface. Exported functions all return a promise or
// throw an error (used with .then() and .catch()
// respectively

// shortcut for setting headers
export const headers = (...types) => {
  var _headers = {}

  var add = (header, value) => _headers[header] = value

  for (var type of types) {
    switch(type) {
      case 'json':
        add( 'Content-Type', 'application/json')
        break
      case 'form':
        add( 'Content-Type', 'application/x-www-form-urlencoded')
        break
      case 'csrf':
        var csrf = document.querySelector('meta[name=csrf-token]')
        if (csrf) add('X-CSRF-Token', csrf.getAttribute('content'))
        break
    }
  }

  return _headers
}

// first responder, split between .then() and .catch() by
// using throw
const checkResponse = (response) => {
  if (response.ok) {
    return response
  } else {
    var Error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

// promise for a json parse of the response
const json = (response) => response.json()

// promise for a json-formatted error message
const json_error = (error) => {
  return error.response.json().then(
    (response) => {
      error.response = response
      throw error
    }
  )
}

// compose a Object into a FormData object
const formBody = (terms) => {
  let form = new FormData()
  for (let key of Object.keys(terms)) {
    form.append(key, terms[key])
  }
  return form
}

// compose an Object into a url-encoded string
const encodeBody = (terms) =>
  Object.keys(terms)
    .reduce(
      (list,key) => [ ...list, `${encodeURIComponent(key)}=${encodeURIComponent(terms[key])}`],
      []
    ).join('&')

// login related functions
export const postLoginEmailPassword = (email, password) => postForm('/login', { email, password })
export const postLogout = (token) => postForm('/logout', { token })
export const postCheckToken = (token) => postForm('/check', { token })

// project admin related functions
export const postProjects = (token) => postForm('/projects', { token })
export const postPermissions = (token) => postForm('/permissions', { token })
export const postUsers = (token) => postForm('/users', { token })
export const postUploadPermissions = (token, permissions) => postJSON('/upload-permissions', { token, permissions })

export const postForm = (path, body) =>
  fetch(
    path,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('form'),
      body: encodeBody(body)
    }
  ).then(checkResponse).then(json).catch(json_error)

export const postJSON = (path, body) =>
  fetch(
    path,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('json'),
      body: JSON.stringify(body)
    }
  ).then(checkResponse).then(json).catch(json_error)
