import { Router } from 'express'
import { getData, setData } from './fs.js'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const config = await getData()
    res.json(config)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:key', async (req, res) => {
  const { key } = req.params
  try {
    const config = await getData()
    if (Object.hasOwn(config, key)) {
      res.json({ [key]: config[key] })
    } else {
      res.status(404).json({ error: 'Key not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/:key', async (req, res) => {
  const { key } = req.params
  const { value } = req.body
  try {
    const config = await getData()
    config[key] = value
    await setData(config)
    res.json({ message: 'Config updated successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:key', async (req, res) => {
  const { key } = req.params
  try {
    const config = await getData()
    if (Object.hasOwn(config, key)) {
      delete config[key]
      await setData(config)
      res.json({ message: 'Config deleted successfully' })
    } else {
      res.status(404).json({ error: 'Key not found' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
