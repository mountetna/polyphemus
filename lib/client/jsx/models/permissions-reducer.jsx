const permission = (state={}, action) => {
  switch(action.type) {
    case 'ADD_PERMISSION':
      let { user_email, project_name, role } = action
      return {
        ...state,
        user_email, project_name, role,
        key: GENERATE_RAND_KEY()
      }
    default:
      return state
  }
}

const projectPermissions = (state={}, action) => {
  switch(action.type) {
    case 'ADD_PERMISSION':
      return {
        ...state,
        [action.user_email]: permission(state[action.user_email], action)
      }
    default:
      return state
  }
}


const permissionsReducer = (state={}, action) => {
  switch(action.type) {
    case 'ADD_PERMISSION':
      return {
        ...state,
        [action.project_name]: projectPermissions(state[action.project_name], action)
      }

    case 'REMOVE_UNSAVED_PERMISSION':
      var nextState = Object.assign({}, state);
      for(var a = 0; a < nextState['permissions']['length']; ++a){

        if(nextState['permissions'][a]['reactKey'] == action['reactKey']){

          nextState['permissions'].splice(a, 1);
        }
      }
      return nextState;

    case 'SAVE_PERMISSIONS':
      var nextState = Object.assign({}, state);
      return nextState;

    default:
      return state
  }
}

export default permissionsReducer
