import Cookies from '../lib/js.cookie.min.js';
import { configureRefreshFetch } from '../lib/refresh-fetch/configureRefreshFetch.js';
import { fetchJSON } from '../lib/refresh-fetch/fetchJSON.js';
import { Config } from '../../config.js';

const retrieveToken = () => Cookies.get(Config.COOKIE_NAME)
const saveToken = token => Cookies.set(Config.COOKIE_NAME, token)
const clearToken = () => Cookies.remove(Config.COOKIE_NAME)

const fetchJSONWithToken = (url, options = {}) => {
  const token = retrieveToken()

  let optionsWithToken = options
  if (token != null) {
    let headers = {
      Authorization: `Bearer ${token}`
    };
    // merge headers, too!
    if (options && typeof options.headers !== 'undefined') {
      headers = Object.assign({}, options.headers, headers);
    }
    if (typeof headers['Content-Type'] === 'undefined') {
      headers['Content-Type'] = 'application/json; charset=UTF-8';
    }
    optionsWithToken = Object.assign({}, options, {
      headers: headers
    })
  }
  // console.log('optionsWithToken fetchJSONWithToken', optionsWithToken);

  return fetchJSON(url, optionsWithToken)
}

const login = (email, password) => {
  let opts = {};
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');
  let query = `query {
    token (
        username: "${email}",
        password: "${password}"
    )
  }`;
  opts = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      query: query
    })
  };
  return fetchJSON(Config.LOGIN_URI, opts)
    .then(response => {
      console.log('response', response);
      saveToken(response.body.data.token)
    })
}

const logout = () => {
  clearToken();
  /*
  return fetchJSONWithToken(Config.LOGOUT_URI, {
    method: 'POST'
  })
    .then(() => {
      clearToken()
    })
    */
}

const shouldRefreshToken = error =>
  error.response.status === 401 &&
  error.body.message === 'Token has expired'

const refreshToken = () => {
  return fetchJSONWithToken(Config.REFRESH_TOKEN_URI, {
    method: 'POST'
  })
    .then(response => {
      saveToken(response.body.refresh_token)
    })
    .catch(error => {
      // Clear token and continue with the Promise catch chain
      clearToken()
      throw error
    })
}

const fetch = configureRefreshFetch({
  fetch: fetchJSONWithToken,
  shouldRefreshToken,
  refreshToken
})

export {
  fetch,
  login,
  logout
}
