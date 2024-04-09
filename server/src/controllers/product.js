import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import removeDiacritics from 'remove-diacritics'
import Product from '../models/Product'
import { productValidation } from '../validations/productValidation'
import Category from '../models/Category'

//* Create product
export const createProduct = asyncHandler(async (req, res) => {
  const { error } = productValidation.validate(req.body)

  if (error) throw new Error(error)
  // Tạo slug duy nhất theo tên sản phẩm
  if (req.body && req.body.productName) {
    const removedDiacriticsString = removeDiacritics(req.body.productName)
    let slug = slugify(removedDiacriticsString, { lower: true })
    let count = 1
    let uniqueSlug = slug
    while (await Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = slug + '-' + count
      count++
    }
    req.body.slug = uniqueSlug
  }

  const newProduct = await Product.create(req.body)

  const updateCategory = await Category.findByIdAndUpdate(
    newProduct.categoryId,
    {
      $addToSet: {
        products: newProduct._id,
      },
    },
  )

  if (!updateCategory) throw new Error('Update category is unsuccessful')

  return res.status(200).json({
    success: newProduct ? true : false,
    products: newProduct ? newProduct : 'Create a new product is unsuccessful',
  })
})

//* Get Products
export const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query }
  // Tách các trường đặc biệt
  const excludeFirelds = ['limit', 'sort', 'page', 'fields']

  excludeFirelds.forEach(el => delete queries[el])

  // Format lại cho đúng cú pháp của mongoose
  // Object to JSON string
  let queryString = JSON.stringify(queries)
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    matchedEl => `$${matchedEl}`,
  )
  // JSON string to object
  const formatQueries = JSON.parse(queryString)

  //Filltering
  if (queries?.productName) {
    formatQueries.productName = { $regex: queries.productName, $options: 'i' }
  }

  let queryCommand = Product.find(formatQueries).populate('categoryId')

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    queryCommand = queryCommand.sort(sortBy)
  }

  // Fields limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ')
    queryCommand = queryCommand.select(fields)
  }

  // Pagination
  const page = +req.query.page || 1
  const limit = +req.query.limit || process.env.LIMIT_PRODUCTS
  const skip = (page - 1) * limit

  queryCommand.skip(skip).limit(limit)

  const response = await queryCommand
  const counts = await Product.countDocuments(formatQueries)

  return res.status(200).json({
    counts,
    success: response ? true : false,
    productDatas: response ? response : 'Cannot get prodcuts',
  })
})

//* Get a Prodcut
export const getAProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params._id).populate('categoryId')

  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : 'Cannot get a detail prodcut',
  })
})

//* Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const { error } = productValidation.validate(req.body, { abortEarly: false })

  if (error) throw new Error(error)

  const product = await Product.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  }).populate('categoryId')

  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : 'Update product is unsuccessful',
  })
})

//* Remove product
export const removeProduct = asyncHandler(async (req, res) => {
  const removeProduct = await Product.findByIdAndDelete(
    req.params._id,
  ).populate('categoryId')

  if (!removeProduct) throw new Error('Delete product is unsuccessful')

  return res.status(200).json({
    success: removeProduct ? true : false,
    product: removeProduct ? removeProduct : 'Delete product is unsuccessful',
  })
})

export const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params
  console.log(req)
  if (!req.files) throw new Error('Missing input')

  const path = req.files.map(el => el.path)

  const response = await Product.findByIdAndUpdate(
    _id,
    { $push: { images: { $each: path } } },
    { new: true },
  )

  return res.status(200).json({
    status: response ? true : false,
    updateProduct: response ? response : ' Cannot upload images product',
  })
})
