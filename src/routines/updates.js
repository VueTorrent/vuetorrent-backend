import axios from 'axios'
import fs from 'fs'
import JSZip from 'jszip'
import * as path from 'node:path'

const BASE_URL = 'https://github.com/VueTorrent/VueTorrent/zipball/'
const STABLE_BRANCH_NAME = 'latest-release'
const DEV_BRANCH_NAME = 'nightly-release'

function getStableLink() {
  return BASE_URL + STABLE_BRANCH_NAME
}

function getDevLink() {
  return BASE_URL + DEV_BRANCH_NAME
}

function getInstalledVersion() {
  try {
    return fs.readFileSync('/vuetorrent/version.txt').toString()
  } catch (err) {
    return null
  }
}

async function downloadFile(url, outputPath) {
  const writer = fs.createWriteStream(outputPath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function unzipFile(zipPath, extractTo) {
  const data = fs.readFileSync(zipPath)
  const zip = await JSZip.loadAsync(data)
  await Promise.all(Object.keys(zip.files).map(async (filename) => {
    const file = zip.files[filename]
    const filePath = path.join(extractTo, filename)
    if (file.dir) {
      fs.mkdirSync(filePath, { recursive: true })
    } else {
      const content = await file.async('nodebuffer')
      fs.writeFileSync(filePath, content)
    }
  }))
}

async function downloadUpdate(link) {
  const tempZipPath = process.env.TEMP_UPDATE_PATH ?? '/tmp/vuetorrent.zip'
  const vuetorrentPath = process.env.VUETORRENT_PATH ?? '/vuetorrent'
  const vuetorrentOldPath = process.env.OLD_VUETORRENT_PATH ?? '/vuetorrent-old'

  // Download zip file
  await downloadFile(link, tempZipPath)

  // Backup current install if it exists
  if (fs.existsSync(vuetorrentOldPath)) {
    fs.rmdirSync(vuetorrentOldPath, { recursive: true })
  }
  if (fs.existsSync(vuetorrentPath)) {
    fs.renameSync(vuetorrentPath, vuetorrentOldPath)
  }

  // Unzip the downloaded file
  try {
    await unzipFile(tempZipPath, vuetorrentPath)
  } catch (err) {
    console.error(err)
    // Restore backup if unzip fails
    if (fs.existsSync(vuetorrentOldPath)) {
      fs.renameSync(vuetorrentOldPath, vuetorrentPath)
    }
  }
}

export async function checkForUpdate() {
  // TODO: Check for current to prevent redundent updates, requires an identifier for dev versions

  switch (process.env.RELEASE_TYPE) {
    case 'dev':
      await downloadUpdate(getDevLink())
      break
    case 'stable':
    default:
      await downloadUpdate(getStableLink())
      break
  }
}
