import { promises as fs } from 'fs'
import path from 'path'

const queue = []

function getDataFilePath() {
  return path.join(process.env.CONFIG_PATH || '/config', 'data.json')
}

async function processQueue() {
  if (queue.length === 0) return

  const { data, resolve, reject } = queue[0]

  try {
    await fs.writeFile(getDataFilePath(), JSON.stringify(data, null, 2))
    resolve()
  } catch (err) {
    reject(err)
  } finally {
    queue.shift()
    await processQueue()
  }
}

export async function getData() {
  const canAccess = await fs.access(getDataFilePath(), fs.constants.F_OK)
    .then(() => true, () => false)

  if (!canAccess) {
    // File doesn't exists
    return {}
  }

  const canEdit = await fs.access(getDataFilePath(), fs.constants.R_OK | fs.constants.W_OK)
    .then(() => true, () => false)

  if (!canEdit) {
    // File not readable / writable
    throw new Error('Data file isn\'t readable / writable')
  }

  return JSON.parse(await fs.readFile(getDataFilePath(), 'utf8'))
}

export async function setData(data) {
  return new Promise((resolve, reject) => {
    queue.push({ data, resolve, reject })
    if (queue.length === 1) {
      processQueue()
    }
  })
}