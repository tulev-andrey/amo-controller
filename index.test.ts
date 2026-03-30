import Amo from './clasess/Amo'
import 'dotenv/config'

if (!process.env.API_URL || !process.env.API_TOKEN) {
  throw new Error('API_URL and API_TOKEN must be set in .env file')
}

const amo = new Amo(process.env.API_URL, process.env.API_TOKEN, { logs: { throwErrors: true } })
// const task: Partial<Task> = {
//   entity_id: 34599807,
//   entity_type: 'contacts',
//   task_type_id: 2346199,
//   text: 'Компания на передачу от Хантинга.',
//   responsible_user_id: 12050238,
//   complete_till: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
// }
// amo.tasks.create([task]).then((task) => {
//   console.log(task)
// })
// const leadNote = {
//   entity_id: 29382031,
//   note_type: '', // Тип заметки - Текстовое примечание
//   params: {
//     text: 'pfvtnrf', // Текст примечания
//   },
// }
// amo.notes.leads.create([leadNote]).then((noteResponse) => {
//   console.log(noteResponse)
// })
amo.contacts
  .get({
    query: 123123123,
  })
  .then((contacts) => {
    console.log(contacts)
  })
