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

const checkResponse = (response) => {
  if (response.ok) {
    return response
  } else {
    var Error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

const json = (response) => response.json()

const json_error = (error) => {
  return error.response.json().then(
    (response) => {
      error.response = response
      throw error
    }
  )
}

const formBody = (terms) => {
  let form = new FormData()
  for (let key of Object.keys(terms)) {
    form.append(key, terms[key])
  }
  return form
}

export const postLoginEmailPassword = (email, password) => postForm('/login', formBody({ email, password }))

export const postCheckToken = (token) => postForm('/check', formBody({ token }))

export const postLogout = (token) => postForm('/logout', formBody({ token }))

export const postForm = (path, body) =>
  fetch(
    path,
    {
      method: 'POST',
      credentials: 'same-origin',
      headers: headers('form'),
      body
    }
  ).then(checkResponse).then(json).catch(json_error)
