import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import authMiddleware from './middlewares/auth.js'
import configRouter from './routers/config.js'
import { assert_env } from './utils.js'

config()

assert_env()

const app = express()

const PORT = process.env.PORT || 3000

app.use(morgan('tiny'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use(authMiddleware)
app.use('/config', configRouter)

app.get('/ping', async (req, res) => {
  res.send('pong')
})

async function handle_signal(signal) {
  console.log(`Received ${ signal } signal. Gracefully shutting down...`)
  process.exit(0)
}

process.on('SIGTERM', handle_signal)
process.on('SIGINT', handle_signal)

app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT }`)
})
