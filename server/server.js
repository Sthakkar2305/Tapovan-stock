import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import sequelize from './config/db.js'
import Stock from './models/Stock.js'
import stockRoutes from './routes/stock.js'
import transactionRoutes from './routes/transactionRoutes.js'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({
  origin: 'https://tapovan-stock.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: false,
}))
app.use(express.json())



// Routes
app.use('/api/stock', stockRoutes)
app.use('/api/transactions', transactionRoutes)

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully' })
})

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Connect DB and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('PostgreSQL connected and tables synced')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Unable to connect to PostgreSQL:', err)
  })
