import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
import User from '../models/User'

dotenv.config()

const { SECRET_CODE } = process.env

export const checkPermission = asyncHandler(async (req, res, next) => {
  // Kiểm tra người dùng đăng nhập chưa
  const token = req.headers.authorization?.split(' ')[1]
  // Kiểm tra token
  if (!token) throw new Error("You haven't logged in")
  // Kiểm tra quyền người dùng
  const decoded = jwt.verify(token, SECRET_CODE)
  const user = await User.findById(decoded._id)

  if (!user) throw new Error('Token is wrong')

  req.user = user
  next()
})

export const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user

  if (role !== 'admin')
    throw new Error("You don't have permission to do this!!!")

  next()
})
