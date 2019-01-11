'use strict'
const Antl = use('Antl')
class UserCreate {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      username: 'required',
      email: 'required|email|unique:users',
      password: 'required|min:6|max:12|confirmed'
    }
  }

  get messages () {
    return Antl.forLocale('pt').list('validation')
  }
}

module.exports = UserCreate
