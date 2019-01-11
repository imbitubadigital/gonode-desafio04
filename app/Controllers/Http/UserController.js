'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)
    return user
  }

  async update ({ request, response, auth: { user } }) {
    try {
      const data = request.only(['old_password', 'password', 'username'])

      if (data.old_password) {
        const isValidOldPassword = await Hash.verify(
          data.old_password,
          user.password
        )

        if (!isValidOldPassword) {
          return response.status(400).send({
            error: {
              message:
                'A senha antiga informada é inválida! Por favor verifique!'
            }
          })
        }

        delete data.old_password
      }

      if (!data.password) {
        delete data.password
      }

      user.merge(data)
      user.save()
      return user
    } catch (err) {
      return response.status(err).send({
        error: { message: 'Erro ao atualizar seu perfil' }
      })
    }
  }
}

module.exports = UserController
