'use strict'

class ShareSchedule {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      emailShare: 'required|email'
    }
  }
  get messages () {
    return {
      'emailShare.required':
        'Por favor informe um email para realizar o compartilhamento.',
      'emailShare.email': 'Por favor informe um e-mail válido.'
    }
  }
}

module.exports = ShareSchedule
