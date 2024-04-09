import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { dbConnect } from './config/dbconnect'
import router from './routes'
import cors from 'cors'

const app = express()
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ['POST', 'PUT', 'GET', 'DELETE'],
  }),
)

dotenv.config()

app.use(cookieParser())

const PORT = process.env.PORT

dbConnect()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
