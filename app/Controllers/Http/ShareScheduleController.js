'use strict'
const Schedule = use('App/Models/Schedule')
const moment = require('moment')
const Kue = use('Kue')
const Job = use('App/Jobs/ShareScheduleMail')
class ShareScheduleController {
  async share ({ request, response, params, auth }) {
    try {
      const emailShare = request.input('emailShare')

      const schedule = await Schedule.query()
        .where('id', params.id)
        .where('user_id', auth.user.id)
        .first()

      if (!schedule) {
        return response
          .status(401)
          .send({ error: { message: 'Agendamentos não localizado' } })
      }
      const passad = moment().isAfter(schedule.date_event)

      if (passad) {
        return response.status(401).send({
          error: {
            message: 'Não é possivel compartilhar eventos que já aconteceram'
          }
        })
      }

      const { title, local } = schedule
      const dateSend = `${moment().format('DD/MM/YYYY')} às ${moment().format(
        'HH:mm'
      )} horas`
      const dateEvent = `${moment(schedule.date_event).format(
        'DD/MM/YYYY'
      )} às ${moment(schedule.date_event).format('HH:mm')} horas`
      const { username, email } = auth.user
      Kue.dispatch(
        Job.key,
        {
          dateSend,
          emailShare,
          title,
          local,
          dateEvent,
          username,
          email
        },
        { attemps: 3 }
      )
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao ler Agendamentos' } })
    }
  }
}

module.exports = ShareScheduleController
