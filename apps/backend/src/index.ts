import cors from 'cors'
import { config } from 'dotenv'
import express from 'express'
import { dockerRouter } from './routes/docker'
import { networkRouter } from './routes/network'
import { servicesRouter } from './routes/services'
import { systemRouter } from './routes/system'

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3021

// CORS configuration based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://server-dashboard.mrspinn.ca']
    : process.env.NODE_ENV === 'staging'
    ? ['https://staging.server-dashboard.mrspinn.ca']
    : ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173', 'http://127.0.0.1:3001'], // Development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

// API routes
app.use('/api/system', systemRouter)
app.use('/api/docker', dockerRouter)
app.use('/api/network', networkRouter)
app.use('/api/services', servicesRouter)

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})