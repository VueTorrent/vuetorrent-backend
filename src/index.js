import cors from 'cors'
import express from 'express'
import configRoutes from './routes/config.js'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors())
app.use('/config', configRoutes)

async function handle_signal(signal) {
  console.log(`Received ${ signal } signal. Gracefully shutting down...`)
  process.exit(0)
}

process.on('SIGTERM', handle_signal)
process.on('SIGINT', handle_signal)

app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT }`)
})
