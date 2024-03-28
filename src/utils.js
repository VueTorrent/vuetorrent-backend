import { promises as fs } from 'fs'

const DATA_FILE_PATH = 'data/data.json'

const queue = []

async function processQueue() {
  if (queue.length === 0) return

  const { data, resolve, reject } = queue[0]

  try {
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
    resolve()
  } catch (err) {
    reject(err)
  } finally {
    queue.shift()
    await processQueue()
  }
}

export async function getData() {
  const canAccess = await fs.access(DATA_FILE_PATH, fs.constants.F_OK)
  .then(() => true, () => false)

  if (!canAccess) {
    // File doesn't exists
    return {}
  }

  const canEdit = await fs.access(DATA_FILE_PATH, fs.constants.R_OK | fs.constants.W_OK)
  .then(() => true, () => false)

  if (!canEdit) {
    // File not readable / writable
    throw new Error('Data file isn\'t readable / writable')
  }

  return JSON.parse(await fs.readFile(DATA_FILE_PATH, 'utf8'))
}

export async function setData(data) {
  return new Promise((resolve, reject) => {
    queue.push({ data, resolve, reject })
    if (queue.length === 1) {
      processQueue()
    }
  })
}

export function assert_env() {
  if (!process.env.QBIT_BASE) {
    throw new Error('QBIT_BASE environment variable is missing')
  }
}
