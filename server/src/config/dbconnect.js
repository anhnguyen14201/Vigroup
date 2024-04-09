import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'

export const dbConnect = asyncHandler(async () => {
  // Kết nối với mongodb
  mongoose.connect(process.env.MONGODB_URI)
  // Đã kết nối
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB')
  })
  // Kiểm tra lỗi
  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err)
  })
  // Kết nối đã đóng
  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB')
  })
})
