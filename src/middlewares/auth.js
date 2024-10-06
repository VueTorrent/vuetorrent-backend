import axios from 'axios'

export default async function authMiddleware(req, res, next) {
  if (req.path === '/ping') {
    return next()
  }
  const { cookies } = req
  const { SID } = cookies

  if (await isValidSID(SID)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

async function isValidSID(SID) {
  const headers = {}
  if (SID) {
    headers['Cookie'] = `SID=${ SID }`
  }

  try {
    const r = await axios.get(`${ process.env.QBIT_BASE }/api/v2/app/version`, { headers })
    return r.status === 200
  } catch (error) {
    console.error('Error occurred while fetching version:')
    if (error.name === 'AggregateError') {
      console.error(error.errors.map(err => err.message).join('\n'))
    } else if (error.response) {
      console.error(`[${error.response.status}] ${error.response.data}`)
    } else {
      console.error(error.name, error.message)
    }

    return false
  }
}
