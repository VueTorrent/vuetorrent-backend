import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Router } from 'express'
import https from 'https'
import morgan from 'morgan'
import scheduler from 'node-schedule'
import authMiddleware from './middlewares/auth.js'
import configRouter from './routers/config/index.js'
import qbitRouter from './routers/qbit/index.js'
import { checkForUpdate } from './routines/update.js'
import { getSSLOptionsFromEnv } from './ssl.js'
import { assert_env } from './utils.js'

assert_env()

const app = express()
const router = Router()

const PORT = process.env.PORT || 3000

// Middlewares
if (process.env.LOG_REQUESTS === 'true') {
  app.use(morgan('tiny'))
}
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
    const [wasUpdated, message] = await checkForUpdate()
    if (!wasUpdated)
      res.status(204)

    res.send(message)
  } catch (err) {
    console.error(err)
    res.status(500).send('Failed to update, see backend logs for details')
  }
})

app.use('/backend', router)

// WebUI
app.use(express.static(`${process.env.VUETORRENT_PATH || '/vuetorrent'}/vuetorrent/public`))
app.use(async (req, res) => {
  res.status(404).send('404 Not Found')
})

function launchServer(serverInstance, protocol) {
  serverInstance.listen(PORT, async () => {
    console.log(`${protocol} server is running on port ${PORT}`)

    const runUpdate = async () => {
      console.log('Checking for updates...')
      console.log((await checkForUpdate())[1])
    }
    await runUpdate()

    const updateCron = process.env.UPDATE_VT_CRON
    if (updateCron && updateCron.length) {
      scheduler.scheduleJob(
        'Update VueTorrent',
        updateCron,
        async () => {
          await runUpdate()
        }
      );
    }
  })
}

const sslOptions = getSSLOptionsFromEnv()
let server
if (sslOptions) {
  const httpsServer = https.createServer(sslOptions, app)
  server = httpsServer
  launchServer(httpsServer, 'HTTPS')
} else {
  server = app
  launchServer(app, 'HTTP')
}

async function stopServer(signal) {
  console.log(`Received ${ signal } signal. Gracefully shutting down...`)
  server.close()
  await scheduler.gracefulShutdown()
}

process.on('SIGTERM', stopServer)
process.on('SIGINT', stopServer)
