"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var currentUser = exports.currentUser = function currentUser(state) {
  return state.login.current_user ? state.users[state.login.current_user] : null;
};