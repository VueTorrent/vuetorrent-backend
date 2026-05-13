import axios from 'axios'

export default async function authMiddleware(req, res, next) {
  if (req.path === '/ping') {
    return next()
  }
  const { cookies } = req
  const { SID } = cookies
  const port = process.env.PORT || '8080'
  const expectedQbtSid = `QBT_SID_${port}`
  const qbtSidName = Object.keys(cookies || {}).find(k => k === expectedQbtSid) || Object.keys(cookies || {}).find(k => /^QBT_SID_\d+$/.test(k))
  const effectiveSid = SID || (qbtSidName ? cookies[qbtSidName] : undefined)
  const effectiveSidName = SID ? 'SID' : qbtSidName

  if (!effectiveSid) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (await isValidSID(effectiveSidName, effectiveSid)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

async function isValidSID(cookieName, SID) {
  const headers = {}
  if (cookieName && SID) {
    headers['Cookie'] = `${ cookieName }=${ SID }`
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
