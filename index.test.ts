import Amo from './clasess/Amo'
import 'dotenv/config'

if (!process.env.API_URL || !process.env.API_TOKEN) {
  throw new Error('API_URL and API_TOKEN must be set in .env file')
}

const amo = new Amo(process.env.API_URL, process.env.API_TOKEN)

amo.tasks.get({ filter: { entity_id: 29382031 } }).then((task) => {
  console.log(task)
})
