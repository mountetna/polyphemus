const project = (state, action) => {
  if (!state) state = {}
  switch(action.type) {
    case 'ADD_PROJECT':
      let { project_name, group_name, project_full_name } = action
      return {
        ...state,
        project_name, group_name, project_full_name
      }
    default:
      return state
  }
}

const projectReducer = (state, action) => {
  if (!state) state = {}
  switch(action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        [action.project_name]: project(state[action.project_name], action)
      }
    default:
      return state;
  }
}

export default projectReducer
