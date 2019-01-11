'use strict'
const Mail = use('Mail')

class ShareScheduleMail {
  static get concurrency () {
    return 1
  }

  static get key () {
    return 'ShareScheduleMail-job'
  }

  async handle ({
    dateSend,
    emailShare,
    title,
    local,
    dateEvent,
    username,
    email
  }) {
    await Mail.send(
      ['emails.share_schedule'],
      {
        username,
        dateSend,
        title,
        local,
        dateEvent
      },
      message =>
        message
          .to(emailShare)
          .from(email, username)
          .subject(`Evento: ${title}`)
    )
  }
}

module.exports = ShareScheduleMail
