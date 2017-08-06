const cleanPermissions = (perms) => {
  for(var index in perms){
    for(var key in perms[index]){
      perms[index][CAMEL_CASE_IT(key)] = perms[index][key];
      if(key.indexOf('_') != -1) delete perms[index][key];
    }
  }

  return perms;
}

const checkAdminPermissions = (perms) => (
  Object.values(perms).some((perm) => perm.role == 'administrator' && perm.projectName == 'Administration')
)

const janusReducer = (state, action) => {
  if (!state) state = {
    userId: null,
    email: '',
    token: '',
    first_name: '',
    last_name: '',
    permissions: []
  }

  switch(action.type) {
    case 'LOG_IN':
      return {
        ...state,
         userEmail: action.email
      }

    case 'LOGGED_IN':
      /* 
       * Copy the new data from the auth server to the local Redux store.
       * Also keep an eye on that 'cleanPermissions' function. The client
       * wants its vars in camel case.
       */
      let permissions = cleanPermissions(action.data.permissions)
      return {
        ...state,
        ...action.data,
        permissions,
        loginStatus: true,
        loginError: false,
        masterPerms: checkAdminPermissions(permissions),
      }

    case 'LOGGED_OUT':
      return {
        ...state,
        userId: null,
        permissions: [],
        masterPerms: false,
        loginStatus: false,
        logError: false,
        loginErrorMsg: 'Invalid sign in.',
      }
    case 'LOG_ERROR':
      return {
        ...state,
        loginStatus: false,
        loginError: true
      }

    default:
      return state
  }
}

export default janusReducer
