import express from 'express'
import httpProxy from 'http-proxy'

const router = express.Router()

const proxy = httpProxy.createProxyServer({
  host: process.env.QBIT_BASE,
  xfwd: true,
  secure: true,
})

router.use((req, res, next) => {
  proxy.web(req, res, { target: `${process.env.QBIT_BASE}/api` }, next)
})

export default router
