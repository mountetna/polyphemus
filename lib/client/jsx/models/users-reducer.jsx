const checkAdminPermissions = (perms) => (
  Object.values(perms).some((perm) => perm.role == 'administrator' && perm.projectName == 'Administration')
)

const user = (state, action) => {
  if (!state) state = { }

  switch(action.type) {
    case 'ADD_USER':
      let { email, first_name, last_name } = action
      return {
        ...state,
        email,
        first_name,
        last_name
      }
    default:
      return state
  }
}

const usersReducer = (state, action) => {
  if (!state) state = {
  }
  switch(action.type) {
    case 'ADD_USER':
      return {
        ...state,
        [action.email]: user(state[action.email], action)
      }
    default:
      return state
  }
}

export default usersReducer
