const express = require('express')
const fs = require('fs').promises

const app = express()
const PORT = 3000
const CONFIG_FILE_PATH = 'data/data.json'

app.use(express.json())

async function getConfig() {
  const canAccess = await fs.access(CONFIG_FILE_PATH, fs.constants.F_OK)
  .then(() => true, () => false)

  if (!canAccess) {
    // File doesn't exists
    return {}
  }

  const canEdit = await fs.access(CONFIG_FILE_PATH, fs.constants.R_OK | fs.constants.W_OK)
  .then(() => true, () => false)

  if (!canEdit) {
    // File not readable / writable
    throw new Error("Data file isn't readable / writable")
  }

  return JSON.parse(await fs.readFile(CONFIG_FILE_PATH, 'utf8'))
}

app.get('/config', async (req, res) => {
  try {
    const config = await getConfig()
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/config/:key', async (req, res) => {
  const { key } = req.params
  try {
    const config = await getConfig()
    if (Object.hasOwn(config, key)) {
      res.json({ [key]: config[key] })
    } else {
      res.status(404).json({ error: 'Key not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/config/:key', async (req, res) => {
  const { key } = req.params
  const { value } = req.body
  try {
    const config = await getConfig()
    config[key] = value
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2))
    res.json({ message: 'Config updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

async function handle_signal(signal) {
  console.log(`Received ${signal} signal. Gracefully shutting down...`)
  process.exit(0)
}

process.on('SIGTERM', handle_signal)
process.on('SIGINT', handle_signal)

app.listen(PORT, () => {
  console.log(`Server is running on port ${ PORT }`)
})
