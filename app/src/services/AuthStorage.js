const LOCAL_KEY = 'fullStockAuthToken'

export default class AuthStorageService {
  static setToken (token) {
    return localStorage.setItem(LOCAL_KEY, token)
  }

  static getToken () {
    return localStorage.getItem(LOCAL_KEY)
  }

  static destroyToken () {
    return localStorage.removeItem(LOCAL_KEY)
  }
}
