import asyncHandler from 'express-async-handler'
import User from '../models/User'

export const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user

  const userCart = await User.findById(_id)
    .select('cart')
    .populate('cart.product', 'productName price')

  if (userCart) {
  }

  return res.json({
    success: userCart ? true : false,
    rs: userCart ? userCart : 'Something went wrong',
  })
})
