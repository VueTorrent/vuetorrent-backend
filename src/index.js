import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import authMiddleware from './middlewares/auth.js'
import configRouter from './routers/config/index.js'
import qbitRouter from './routers/qbit/index.js'
import { checkForUpdate } from './routines/update.js'
import { assert_env } from './utils.js'

config()

assert_env()

const app = express()

const PORT = process.env.PORT || 3000

// Middlewares
app.use(morgan('tiny'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routers
app.use('/api', qbitRouter)
app.use('/config', authMiddleware, configRouter)

// Routes
app.get('/ping', async (req, res) => {
  res.send('pong')
})
app.get('/update', authMiddleware, async (req, res) => {
  try {
    res.send(await checkForUpdate())
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to update')
  }
})

// WebUI
app.use(express.static('/vuetorrent/vuetorrent/public'))
app.use(async (req, res) => {
  res.status(404).send('Unable to find vuetorrent installation, please make sure it is accessible at /vuetorrent/public')
})

const server = app.listen(PORT, async () => {
  console.log('Checking for updates...')
  console.log(await checkForUpdate())
  console.log(`Server is running on port ${ PORT }`)
})

async function stopServer(signal) {
  console.log(`Received ${ signal } signal. Gracefully shutting down...`)
  server.close()
}

process.on('SIGTERM', stopServer)
process.on('SIGINT', stopServer)
