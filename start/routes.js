'use strict'
const Route = use('Route')

Route.post('users', 'UserController.store').validator('UserCreate')

Route.post('sessions', 'SessionController.store').validator('Sessions')

Route.post('recover', 'ForgotPasswordController.store').validator(
  'ForgotPassword'
)
Route.put('recover', 'ForgotPasswordController.update').validator(
  'ResetPassword'
)

Route.group(() => {
  Route.put('users', 'UserController.update').validator('UserUpdate')
  Route.resource('schedules', 'ScheduleController')
    .apiOnly()
    .validator(
      new Map([
        [['schedules.store'], ['Schedule']],
        [['schedules.update'], ['Schedule']]
      ])
    )
  Route.post('schedule/:id/share', 'ShareScheduleController.share').validator(
    'ShareSchedule'
  )
}).middleware('auth')
