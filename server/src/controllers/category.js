import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import removeDiacritics from 'remove-diacritics'
import { categoryValidation } from '../validations/categoryValidation'
import Category from '../models/Category'

// Create a new category
export const createCategory = asyncHandler(async (req, res) => {
  const { error } = categoryValidation.validate(req.body, { abortEarly: false })
  if (error) throw new Error(error)
  // Tạo slug duy nhất theo tên sản phẩm
  if (req.body && req.body.categoryName) {
    const removedDiacriticsString = removeDiacritics(req.body.categoryName)
    let slug = slugify(removedDiacriticsString, { lower: true })
    let count = 1
    let uniqueSlug = slug
    while (await Category.findOne({ slug: uniqueSlug })) {
      uniqueSlug = slug + '-' + count
      count++
    }
    req.body.slug = uniqueSlug
  }

  const newCategory = await Category.create(req.body)

  return res.status(200).json({
    status: newCategory ? true : false,
    dataCategory: newCategory ? newCategory : 'Create category is unsuccessful',
  })
})

//* Get Category
export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.find({}).populate('products')

  return res.status(200).json({
    success: category ? true : false,
    category: category ? category : 'Cannot get a detail category',
  })
})

//* Get a Category
export const getACategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params._id).populate('products')

  return res.status(200).json({
    success: category ? true : false,
    category: category ? category : 'Cannot get a detail category',
  })
})

//* Update Category
export const updateCategory = asyncHandler(async (req, res) => {
  const { error } = categoryValidation.validate(req.body, { abortEarly: false })

  if (error) throw new Error(error)

  const category = await Category.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
  })

  return res.status(200).json({
    success: category ? true : false,
    category: category ? category : 'Update category is unsuccessful',
  })
})

//* Remove Category
export const removeCategory = asyncHandler(async (req, res) => {
  const removeCategory = await Category.findByIdAndDelete(req.params._id)

  if (!removeCategory) throw new Error('Delete category is unsuccessful')

  return res.status(200).json({
    success: removeCategory ? true : false,
    category: removeCategory
      ? removeCategory
      : 'Delete category is unsuccessful',
  })
})
