'use strict'
const moment = require('moment')
const Schedule = use('App/Models/Schedule')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with shudeles
 */
class ScheduleController {
  /**
   * Show a list of all shudeles.
   * GET shudeles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, auth }) {
    try {
      const { data, page } = request.get()

      const schedules = await Schedule.query()
        .where('user_id', auth.user.id)
        .where(function () {
          if (data) {
            this.where('date_event', '>=', `${data} 00:00:00`).where(
              'date_event',
              '<=',
              `${data} 23:59:59`
            )
          }
        })
        .with('user')
        .paginate(page)

      return schedules
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao ler Agendamentos' } })
    }
  }

  /**
   * Create/save a new shudele.
   * POST shudeles
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    try {
      const data = request.only(['title', 'local', 'date_event'])

      const isSchedule = await Schedule.query()
        .where('date_event', data.date_event)
        .where('user_id', auth.user.id)
        .first()

      if (isSchedule) {
        return response.status(401).send({
          error: {
            message: 'Já existe um agendamento cadastrado nesse horário'
          }
        })
      }
      const schedule = await Schedule.create({
        ...data,
        user_id: auth.user.id
      })
      // await schedule.load('user')
      return schedule
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao cadastrar evento na agenda' } })
    }
  }

  /**
   * Display a single shudele.
   * GET shudeles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ response, params, auth }) {
    try {
      const schedule = await Schedule.query()
        .where('id', params.id)
        .where('user_id', auth.user.id)
        .first()

      if (!schedule) {
        return response
          .status(401)
          .send({ error: { message: 'Agendamento não localizado' } })
      }

      return schedule
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao selecionar agendamento' } })
    }
  }

  /**
   * Update shudele details.
   * PUT or PATCH shudeles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    try {
      const data = request.only(['title', 'local', 'date_event'])

      const isSchedule = await Schedule.query()
        .where('date_event', data.date_event)
        .where('user_id', auth.user.id)
        .where('id', '!=', params.id)
        .first()

      if (isSchedule) {
        return response.status(401).send({
          error: {
            message: 'Já existe um agendamento cadastrado nesse horário'
          }
        })
      }

      const schedule = await Schedule.query()
        .where('id', params.id)
        .where('user_id', auth.user.id)
        .first()

      if (!schedule) {
        return response
          .status(401)
          .send({ error: { message: 'Agendamento não localizado' } })
      }

      const passad = moment().isAfter(schedule.date_event)

      if (passad) {
        return response
          .status(401)
          .send({
            error: { message: 'Não é possível editar agendamentos passados' }
          })
      }

      schedule.merge(data)

      await schedule.save()
      return schedule
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao editar agendamento' } })
    }
  }

  /**
   * Delete a shudele with id.
   * DELETE shudeles/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response, auth }) {
    try {
      const schedule = await Schedule.query()
        .where('id', params.id)
        .where('user_id', auth.user.id)
        .first()

      if (!schedule) {
        return response
          .status(401)
          .send({ error: { message: 'Agendamento não localizado' } })
      }

      const passad = moment().isAfter(schedule.date_event)

      if (passad) {
        return response
          .status(401)
          .send({
            error: { message: 'Não é possível deletar agendamentos passados' }
          })
      }

      await schedule.delete()
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Erro ao deletar agendamento' } })
    }
  }
}

module.exports = ScheduleController
