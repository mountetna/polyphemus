export const permissionList = (state) => [].concat(
  ...Object.values(state.permissions).map(
    (project_permission) => Object.values(project_permission)
  )
)
