import { Router } from 'express'
import httpProxy from 'http-proxy'

const router = Router()

router.use((req, res, next) => {
  const proxy = httpProxy.createProxyServer({
    host: process.env.QBIT_BASE,
    xfwd: process.env.REMAIN_X_FORWARD_HEADERS !== 'true',
    secure: process.env.USE_INSECURE_SSL !== 'true',
  })
  proxy.web(req, res, { target: `${process.env.QBIT_BASE}/api` }, next)
})

export default router
