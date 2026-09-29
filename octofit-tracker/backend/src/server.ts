import express from 'express'
import mongoose from 'mongoose'
import './config/database.js'
import { apiRouter } from './routes/api.js'

const app = express()
const port = 8000
const codespaceName = process.env.CODESPACE_NAME
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'
const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(codespaceName ? [`https://${codespaceName}-5173.app.github.dev`] : []),
])

app.use(express.json())

app.use((request, response, next) => {
  const origin = request.get('origin')

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader('Access-Control-Allow-Origin', origin)
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    response.setHeader('Vary', 'Origin')
  }

  if (request.method === 'OPTIONS') {
    response.sendStatus(origin && allowedOrigins.has(origin) ? 204 : 403)
    return
  }

  next()
})

app.get('/api/config', (_request, response) => {
  response.json({ baseUrl })
})

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
  })
})

app.use('/api', apiRouter)

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: error.message })
    return
  }

  console.error(error)
  response.status(500).json({ error: 'Internal server error' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening at ${baseUrl}`)
})