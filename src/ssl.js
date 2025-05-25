import fs from 'fs'

export function getSSLOptionsFromEnv() {
  const SSL_CERT = process.env.SSL_CERT
  const SSL_KEY = process.env.SSL_KEY
  const SSL_CERT_PATH = process.env.SSL_CERT_PATH
  const SSL_KEY_PATH = process.env.SSL_KEY_PATH

  let cert, key
  if (SSL_CERT && SSL_KEY) {
    cert = SSL_CERT
    key = SSL_KEY
  } else if (
    SSL_CERT_PATH && SSL_KEY_PATH &&
    fs.existsSync(SSL_CERT_PATH) && fs.existsSync(SSL_KEY_PATH)
  ) {
    cert = fs.readFileSync(SSL_CERT_PATH)
    key = fs.readFileSync(SSL_KEY_PATH)
  }

  if (cert && key) {
    return { cert, key }
  }

  return null
}
