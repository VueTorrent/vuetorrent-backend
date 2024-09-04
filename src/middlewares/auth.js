import axios from 'axios'

export default async function authMiddleware(req, res, next) {
  if (req.path === '/ping') {
    return next()
  }
  const { cookies } = req
  const { SID } = cookies

  if (SID && await isValidSID(SID)) {
    next()
  } else {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

async function isValidSID(SID) {
  try {
    const r = await axios.get(`${process.env.QBIT_BASE}/api/v2/app/version`, {
      headers: {
        'Cookie': `SID=${ SID }`
      }
    })
    return r.status === 200
  } catch (error) {
    console.error('Error occurred while fetching version:', error)
    return false
  }
}
