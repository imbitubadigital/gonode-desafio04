'use strict'
// crypto ja vem com o node acima da versao 10
const crypto = require('crypto')
const User = use('App/Models/User')
const Mail = use('Mail')
const moment = require('moment')
class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)
      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()
      await Mail.send(
        ['emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`
        },
        message =>
          message
            .to(user.email)
            .from('empresa@empresa.com', 'Setor Adninstrativo')
            .subject('Recuperação de senha')
      )
    } catch (err) {
      return response
        .status(err)
        .send({ error: { message: 'Algo não deu certo. Esse email existe?' } })
    }
  }

  async update ({ request, response }) {
    try {
      const { password, token } = request.all()
      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract(2, 'days')
        .isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({
          error: { message: 'O token de recuperação está expirado.' }
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      await user.save()
    } catch (err) {
      return response.status(err).send({
        error: { message: 'Algo não deu errado ao resetar sua senha?' }
      })
    }
  }
}

module.exports = ForgotPasswordController
