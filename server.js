const express = require('express')
const fs = require('fs').promises

const app = express()
const PORT = 3000
const CONFIG_FILE_PATH = 'data/data.json'

app.use(express.json())

app.get('/config', async (req, res) => {
  try {
    const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf8')
    const config = JSON.parse(configData)
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/config/:key', async (req, res) => {
  const { key } = req.params
  try {
    const configData = await fs.readFile(CONFIG_FILE_PATH, 'utf8')
    const config = JSON.parse(configData)
    if (config.hasOwnProperty(key)) {
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
    let configData = await fs.readFile(CONFIG_FILE_PATH, 'utf8')
    let config = JSON.parse(configData)
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
