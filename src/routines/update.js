import axios from 'axios'
import { config } from 'dotenv'
import fs from 'fs'
import JSZip from 'jszip'
import path from 'path'

config()


const BASE_URL_VERSION = 'https://api.github.com/repos/VueTorrent/VueTorrent/contents/version.txt?ref='
const BASE_URL_ZIPBALL = 'https://api.github.com/repos/VueTorrent/VueTorrent/zipball/'
const STABLE_BRANCH_NAME = 'latest-release'
const DEV_BRANCH_NAME = 'nightly-release'
const VERSION_PATTERN = /^v?(?<version>[0-9.]+)(-(?<commits>\d+)-g(?<sha>[0-9a-f]+))?$/

const BASE_FS_PATH = process.env.VUETORRENT_PATH || '/vuetorrent'
const TEMP_ZIP_PATH = `${ BASE_FS_PATH }/vuetorrent.zip`
const WEBUI_PATH = `${ BASE_FS_PATH }/vuetorrent`
const VERSION_FILE_PATH = `${ WEBUI_PATH }/version.txt`
const WEBUI_OLD_PATH = `${ BASE_FS_PATH }/vuetorrent-old`

function extractVersion(version) {
  const match = version.match(VERSION_PATTERN)
  return match?.groups
}

function formatVersion(version) {
  if (!version) return 'unknown'
  if (!version.commits || !version.sha) return `v${ version.version }`
  return `v${ version.version }-${ version.commits }-g${ version.sha }`
}

function getInstalledVersion() {
  if (!fs.existsSync(VERSION_FILE_PATH)) return null

  try {
    return extractVersion(fs.readFileSync(VERSION_FILE_PATH).toString())
  } catch (err) {
    console.error(err)
    return null
  }
}

async function getLatestVersion(url) {
  /** @type {AxiosResponse<Record<string, any>>} */
  const response = await axios.get(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json'
    }
  })

  // Extract from base64
  return extractVersion(atob(response.data.content.trim()))
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
    const newName = filename.slice(filename.indexOf('/'))
    const filePath = path.join(extractTo, newName)
    if (file.dir) {
      fs.mkdirSync(filePath, { recursive: true })
    } else {
      const content = await file.async('nodebuffer')
      fs.writeFileSync(filePath, content)
    }
  }))
}

async function downloadUpdate(link) {
  if (!fs.existsSync(BASE_FS_PATH)) {
    fs.mkdirSync(BASE_FS_PATH, { recursive: true })
  }

  // Download zip file
  await downloadFile(link, TEMP_ZIP_PATH)

  // Backup current install if it exists
  if (fs.existsSync(WEBUI_OLD_PATH)) {
    fs.rmSync(WEBUI_OLD_PATH, { recursive: true })
  }
  if (fs.existsSync(WEBUI_PATH)) {
    fs.renameSync(WEBUI_PATH, WEBUI_OLD_PATH)
  }

  // Unzip the downloaded file
  try {
    await unzipFile(TEMP_ZIP_PATH, WEBUI_PATH)
  } catch (err) {
    console.error(err)
    // Restore backup if unzip fails
    if (fs.existsSync(WEBUI_OLD_PATH)) {
      fs.renameSync(WEBUI_OLD_PATH, WEBUI_PATH)
    }
  }
}

export async function checkForUpdate() {
  let versionUrl, downloadUrl
  switch (process.env.RELEASE_TYPE) {
    case 'dev':
      versionUrl = BASE_URL_VERSION + DEV_BRANCH_NAME
      downloadUrl = BASE_URL_ZIPBALL + DEV_BRANCH_NAME
      break
    case 'stable':
    default:
      versionUrl = BASE_URL_VERSION + STABLE_BRANCH_NAME
      downloadUrl = BASE_URL_ZIPBALL + STABLE_BRANCH_NAME
      break
  }

  const installedVersion = getInstalledVersion()
  const latestVersion = await getLatestVersion(versionUrl)

  if (installedVersion?.version !== latestVersion?.version
    || installedVersion?.commits !== latestVersion?.commits
    || installedVersion?.sha !== latestVersion?.sha) {
    await downloadUpdate(downloadUrl)
    return `Update successful from ${ formatVersion(installedVersion) } to ${ formatVersion(latestVersion) }`
  }
  return 'Already using the latest version'
}
