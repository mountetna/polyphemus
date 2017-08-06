import * as Cookies from 'js-cookie'


let TOKEN_NAME = 'UCSF_ETNA_AUTH_TOKEN'

let COOKIE_PATH = { path: '/' }

export const getToken = () => Cookies.get(TOKEN_NAME)
export const setToken = (token) => Cookies.set(
  TOKEN_NAME, token, { expires: 1, ...COOKIE_PATH }
)
export const removeToken = () => Cookies.remove(
  TOKEN_NAME, COOKIE_PATH
) 
