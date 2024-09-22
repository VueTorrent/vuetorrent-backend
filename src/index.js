import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express, { Router } from 'express'
import morgan from 'morgan'
import { scheduleJob } from 'node-schedule'
import authMiddleware from './middlewares/auth.js'
import configRouter from './routers/config/index.js'
import qbitRouter from './routers/qbit/index.js'
import { checkForUpdate } from './routines/update.js'
import { assert_env } from './utils.js'

config()
assert_env()

const app = express()
const router = Router()

const PORT = process.env.PORT || 3000

// Middlewares
app.use(morgan('tiny'))
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Routers
app.use('/api', qbitRouter)
router.use('/config', authMiddleware, configRouter)

// Routes
router.get('/ping', async (req, res) => {
  res.send('pong')
})
router.get('/update', authMiddleware, async (req, res) => {
  try {
    res.send(await checkForUpdate())
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to update')
  }
})

app.use('/backend', router)

// WebUI
app.use(express.static(`${process.env.VUETORRENT_PATH || '/vuetorrent'}/vuetorrent/public`))
app.use(async (req, res) => {
  res.status(404).send('404 Not Found')
})

const server = app.listen(PORT, async () => {
  console.log('Checking for updates...')
  console.log(await checkForUpdate())
  console.log(`Server is running on port ${ PORT }`)

  const update_cron = process.env.UPDATE_VT_CRON
  if (update_cron && update_cron.length) {
    scheduleJob(
      'Update VueTorrent',
      update_cron,
      async () => {
        return await checkForUpdate()
      }
    );
  }
})

async function stopServer(signal) {
  console.log(`Received ${ signal } signal. Gracefully shutting down...`)
  server.close()
}

process.on('SIGTERM', stopServer)
process.on('SIGINT', stopServer)
