import { promises as fs } from 'fs'

const DATA_FILE_PATH = 'data/data.json'

async function getData() {
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

async function setData(data) {
  return await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2))
}

export {
  getData,
  setData
}