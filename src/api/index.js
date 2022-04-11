const api = {
  Login: '/auth/realms/quartet-data-portal/protocol/openid-connect/token',
  Logout: '/auth/realms/quartet-data-portal/protocol/openid-connect/logout',
  ForgePassword: '/auth/realms/quartet-data-portal/login-actions/reset-credentials?client_id=security-admin-console',
  Register: '/auth/realms/quartet-data-portal/login-actions/registration?client_id=security-admin-console',
  // get my info
  UserInfo: '/auth/realms/quartet-data-portal/protocol/openid-connect/userinfo'
}

export default api
