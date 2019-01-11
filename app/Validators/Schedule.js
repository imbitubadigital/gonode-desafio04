'use strict'
// const Antl = use('Antl')
const { rule } = use('Validator')
class Schedule {
  get validateAll () {
    return true
  }
  get rules () {
    return {
      title: 'required',
      local: 'required',
      // date_event: 'after:2019-01-22 21:00:00'
      date_event: [
        rule('required'),
        rule('date_format', 'YYYY-MM-DD HH:mm:ss'),
        rule('after', new Date())
      ]
    }
  }

  get messages () {
    return {
      'title.required': 'O titulo deve ser preenchido.',
      'local.required': 'O local do evento deve ser preenchido.',
      'date_event.required': 'A data do Evento deve ser preenchida',
      'date_event.after':
        'A data e horário informado deve ser maior que a data e horário atual.',
      'date_event.date_format': 'A data do estar no formato YYYY-MM-DD HH:mm:ss'
    }
  }

  /*
  get messages () {
    return Antl.forLocale('pt').list('validation')
  }
  */
}

module.exports = Schedule
