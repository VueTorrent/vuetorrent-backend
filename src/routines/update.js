import axios from 'axios'
import fs from 'fs'
import JSZip from 'jszip'
import * as path from 'node:path'

const BASE_URL = 'https://api.github.com/repos/VueTorrent/VueTorrent/releases/'
const STABLE_BRANCH_NAME = 'latest'
const DEV_BRANCH_NAME = 'tags/latest_nightly'
const PRERELEASE_VERSION_PATTERN = /v[\w-.]+-\d+-g[0-9a-f]+/

function getInstalledVersion() {
  try {
    return fs.readFileSync('/vuetorrent/version.txt').toString()
  } catch (err) {
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

  let version = response.data.tag_name
  if (response.data.prerelease) {
    version = response.data.name.match(PRERELEASE_VERSION_PATTERN)?.[0]
  }
  const download_url = response.data.assets[0].browser_download_url

  return { version, download_url }
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
  const tempZipPath = '/tmp/vuetorrent.zip'
  const vuetorrentPath = '/vuetorrent'
  const vuetorrentOldPath = '/vuetorrent-old'

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
  let url
  switch (process.env.RELEASE_TYPE) {
    case 'dev':
      url = BASE_URL + DEV_BRANCH_NAME
      break
    case 'stable':
    default:
      url = BASE_URL + STABLE_BRANCH_NAME
      break
  }

  const installedVersion = getInstalledVersion()
  const { version, download_url } = await getLatestVersion(url)

  if (installedVersion !== version) {
    await downloadUpdate(download_url)
  }
}
