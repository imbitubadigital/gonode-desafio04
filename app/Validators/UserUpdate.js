'use strict'
const Antl = use('Antl')
class UserCreate {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      username: 'required',
      password: 'required_if:old_password|min:6|confirmed',
      old_password: 'required_if:password'
    }
  }
  get messages () {
    return Antl.forLocale('pt').list('validation')
  }
}

module.exports = UserCreate
