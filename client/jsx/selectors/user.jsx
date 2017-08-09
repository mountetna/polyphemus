export const currentUser = (state) => state.login.current_user ?  state.users[state.login.current_user] : null
