let sessionToken = null;
let sessionUser = null;

export function setSession(token, user) {
  sessionToken = token;
  sessionUser = user;
}

export function getSession() {
  return { token: sessionToken, user: sessionUser };
}

export function isLoggedIn() {
  return !!sessionToken;
}

export function logout() {
  sessionToken = null;
  sessionUser = null;
}
