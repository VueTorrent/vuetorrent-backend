import { Router } from 'express'
import httpProxy from 'http-proxy'

const router = Router()

router.use((req, res, next) => {
  console.log('Incoming headers:', req.headers)

  const proxy = httpProxy.createProxyServer({
    host: process.env.QBIT_BASE,
    xfwd: true,
    secure: process.env.USE_INSECURE_SSL !== 'true',
  })

  proxy.on('proxyReq', proxyReq => {
    console.log('Forwarding headers:', proxyReq.getHeaders())
  })

  proxy.web(req, res, { target: `${ process.env.QBIT_BASE }/api` }, next)
})

export default router
