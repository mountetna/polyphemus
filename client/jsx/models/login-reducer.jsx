const loginReducer = (state, action) => {
  if (!state) state = { }
  switch(action.type) {
    case 'LOGGED_IN':
      return {
        ...state,
        current_user: action.email,
        error: null
      }
    case 'LOGGED_OUT':
      return {
        ...state,
        current_user: null,
        permissions: []
      }
    case 'LOG_ERROR':
      return {
        ...state,
        current_user: null,
        error: action.error
      }
    default:
      return state
  }
}

export default loginReducer
