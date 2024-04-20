import asyncHandler from 'express-async-handler'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
//import makeToken from 'uniqueid'
import crypto from 'crypto'
import { signInValidator, signUpValidator } from '../validations/userValidation'
import User from '../models/User'
import { sendEmail } from '../ultils/sendEmail'

dotenv.config()

const { SECRET_CODE } = process.env

// Sign Up
export const signUp = asyncHandler(async (req, res) => {
  // Kiểm tra xác nhận dữ liệu người dùng nhập vào
  const { error } = signUpValidator.validate(req.body, { abortEarly: false })

  if (error) throw new Error(error.message).message

  // Kiểm tra email đã tồn tại chưa
  const emailExist = await User.findOne({ email: req.body.email })

  if (emailExist)
    throw new Error('Email has been registered. Do you want to login ???')

  // Mã hóa password
  const hashedPassword = await bcryptjs.hash(req.body.password, 10)

  // Khởi tạo user trong DB
  const user = await User.create({
    ...req.body,
    password: hashedPassword,
  })
  //Loại bỏ trường password trước khi gửi response
  user.password = undefined
  // Thông báo cho người dùng đăng ký thành công
  return res.status(200).json({
    success: user ? true : false,
    user,
  })
})

//* Register

/* export const signUp = asyncHandler(async (req, res) => {
  // Lấy email từ client gửi lên
  const email = req.body.email

  const { error } = signUpValidator.validate(req.body, { abortEarly: false })

  if (error) throw new Error(error)

  const token = makeToken()

  res.cookie(
    'dataregister',
    { ...req.body, token },
    {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    },
  )

  const html = `
  Hi [name],
  Thanks for getting started with our [customer portal]!
  
  We need a little more information to complete your registration, including a confirmation of your email address.
  
  Click below to confirm your email address:
  
  <a href=${process.env.URL_SERVER}/api/user/final-register/${token}> Click here</a> 
    `
  await sendEmail({ email, html, subject: 'Hoàn tất đăng ký Digital World' })

  return res.json({
    success: true,
    message: 'Please check your email to active account',
  })
})

export const finalRegister = asyncHandler(async () => {
  const cookie = req.cookies

  return res.json({
    success: true,
    cookie,
  })
}) */
//* Login
export const signIn = asyncHandler(async (req, res) => {
  // Validate data từ phía client
  const { error } = signInValidator.validate(req.body, { abortEarly: false })

  if (error) throw new Error(error).message

  // Kiểm tra email có tồn tại không
  const user = await User.findOne({ email: req.body.email })

  if (!user) throw new Error(error).message

  // Kiểm tra password
  const isMatch = await bcryptjs.compare(req.body.password, user.password)

  if (!isMatch) throw new Error('Mật khẩu không đúng').message

  // Tạo JWT
  // Tạo access token
  const accessToken = jwt.sign({ _id: user._id }, SECRET_CODE, {
    expiresIn: '1h',
  })
  // Tạo refresh token
  const refreshToken = jwt.sign({ _id: user._id }, SECRET_CODE, {
    expiresIn: '24h',
  })
  // Lưu refresh token vào database
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken: refreshToken },
    { new: true },
  )
  // Lưu refresh token vào cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  })
  // Thông báo cho người dùng
  return res.status(200).json({
    success: true,
    user,
    accessToken,
    refreshToken,
  })
})

//* Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  // Lấy email từ client gửi lên
  const { email } = req.query

  // Kiểm tra xem email có tồn tại không
  if (!email) throw new Error('Email is not found')

  // Kiểm tra email có tồn tại trong DB không
  const user = await User.findOne({ email })

  if (!user) throw new Error('User is not found')

  // Tạo mã token để đặt lại mật khẩu
  const resetToken = user.createPasswordChangedToken()

  // Lưu lại thông tin user sau khi tạo token
  await user.save()

  // Tạo nội dung email
  const html = `
        Hi ,
        There was a request to change your password!
        <br>
        If you did not make this request then please ignore this email.
        <br>
        Otherwise, please click this link to change your password: 
        <a href=${process.env.URL_SERVER}/api/user/reset-password/${resetToken}> Click here</a> 
    `

  const data = {
    email,
    html,
    subject: 'Forgot password',
  }

  const rs = await sendEmail(data)

  return res.status(200).json({
    success: rs ? true : false,
    rs,
  })
})

//* Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body
  if (!password || !token) throw new Error('Missing input')

  const passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex')
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  if (!user) throw new Error('User is not found')

  // Mã hóa mật khẩu mới
  const hashedPassword = await bcryptjs.hash(password, 10)

  // Cập nhật thông tin mật khẩu mới cho user
  user.password = hashedPassword
  user.passwordResetToken = undefined
  user.passwordChangedAt = Date.now()
  user.passwordResetExpires = undefined

  // Lưu lại thông tin user
  await user.save()

  return res.status(200).json({
    success: user ? true : false,
  })
})

//* Cấp mới token
export const refreshAccessToken = asyncHandler(async (req, res) => {
  // Lấy token từ cookie
  const cookie = req.cookies
  // Kiểm tra xem có token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error('There is no refresh token in cookies')
  //Kiểm tra token có hợp lệ không
  const rs = await jwt.verify(cookie.refreshToken, SECRET_CODE)
  // Tìm người dùng tương ứng với token
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  })

  if (!response) throw new Error('Refresh token is not matched')
  // Tạo lại access token
  const newAcessToken = jwt.sign({ _id: response._id }, SECRET_CODE, {
    expiresIn: '1h',
  })

  return res.status(200).json({
    success: newAcessToken ? true : false,
    newAcessToken,
  })
})

//* Logout
export const logOut = asyncHandler(async (req, res) => {
  // Lấy token từ cookies
  const cookie = req.cookies
  // Kiểm tra xem có token không
  if (!cookie && !cookie.refreshToken)
    throw new Error('There is no refresh token in cookies')
  // Xóa refresh token ở DB
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: '' },
    { new: true },
  )
  // Xóa refresh token ở cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  })

  return res.status(200).json({
    success: true,
    message: 'Logout',
  })
})

//* Get data of all users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})

  return res.status(200).json({
    success: users ? true : false,
    users: users,
  })
})

//* Get data of a user
export const getUser = asyncHandler(async (req, res) => {
  console.log(req)
  const { _id } = req.user

  const data = await User.findById(_id)

  return res.status(200).json({
    status: data ? true : false,
    data,
  })
})

//* Update user
export const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error('No user to update')

  const data = await User.findByIdAndUpdate(_id, req.body, { new: true })

  return res.status(200).json({
    success: data ? true : false,
    data,
  })
})

//* Update by admin
export const updateByAdmin = asyncHandler(async (req, res) => {
  const { _id } = req.params

  if (Object.keys(req.body).length === 0) throw new Error('No user to update')

  const data = await User.findByIdAndUpdate(_id, req.body, { new: true })

  return res.status(200).json({
    success: data ? true : false,
    data,
  })
})

//* Delete User
export const removeUser = asyncHandler(async (req, res) => {
  const { _id } = req.query

  if (!_id) throw new Error('No user')

  const data = await User.findByIdAndDelete(_id)

  return res.status(200).json({
    success: data ? true : false,
    data,
  })
})

//* Update giỏ hàng
export const updateCart = asyncHandler(async (req, res) => {
  const userID = req.user
  const { _id, quantity } = req.body

  if (!_id || !quantity) throw new Error('Missing input')

  const user = await User.findById(userID).select('cart')

  const alreadyProduct = user?.cart?.find(
    el => el.product.toString() === _id.toString(),
  )

  if (alreadyProduct) {
    const response = await User.findOneAndUpdate(
      { _id: userID, 'cart.product': _id },
      { $inc: { 'cart.$.quantity': quantity } },
      { new: true },
    )

    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing was wrong',
    })
  } else {
    const response = await User.findByIdAndUpdate(
      userID,
      { $push: { cart: { product: _id, quantity } } },
      { new: true },
    )
    return res.status(200).json({
      success: response ? true : false,
      updateUser: response ? response : 'Some thing was wrong',
    })
  }
})
