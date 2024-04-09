import asyncHandler from 'express-async-handler'
import slugify from 'slugify'
import removeDiacritics from 'remove-diacritics'
import Product from '../models/Product'
import { modelDesignValidation } from '../validations/modelDesignValidation'
import Category from '../models/Category'
import Modeldesign from '../models/Modeldesign'

//* Create ModelDesign
export const createModelDesign = asyncHandler(async (req, res) => {
  const { error } = modelDesignValidation.validate(req.body)

  const newModelDesign = await Modeldesign.create(req.body)

  return res.status(200).json({
    success: newModelDesign ? true : false,
    newModelDesign: newModelDesign
      ? newModelDesign
      : 'Create a new product is unsuccessful',
  })
})

//* Get ModelDesign
export const getModelDesigns = asyncHandler(async (req, res) => {
  const modelDesigns = await Modeldesign.find({})
  return res.status(200).json({
    success: modelDesigns ? true : false,
    modelDesigns: modelDesigns ? modelDesigns : 'Cannot get prodcuts',
  })
})

//* Get a ModelDesign
export const getAModelDesign = asyncHandler(async (req, res) => {
  const modelDesign = await Modeldesign.findById(req.params._id)

  return res.status(200).json({
    success: modelDesign ? true : false,
    modelDesign: modelDesign ? modelDesign : 'Cannot get a detail prodcut',
  })
})

//* Update ModelDesign
export const updateModelDesign = asyncHandler(async (req, res) => {
  const { error } = modelDesignValidation.validate(req.body, {
    abortEarly: false,
  })

  if (error) throw new Error(error)

  const newModelDesign = await Modeldesign.findByIdAndUpdate(
    req.params._id,
    req.body,
    {
      new: true,
    },
  )

  return res.status(200).json({
    success: newModelDesign ? true : false,
    newModelDesign: newModelDesign
      ? newModelDesign
      : 'Update product is unsuccessful',
  })
})

//* Remove ModelDesign
export const removeModelDesign = asyncHandler(async (req, res) => {
  const removeModelDesign = await Modeldesign.findByIdAndDelete(req.params._id)

  if (!removeModelDesign) throw new Error('Delete product is unsuccessful')

  return res.status(200).json({
    success: removeModelDesign ? true : false,
    newModelDesign: removeModelDesign
      ? removeModelDesign
      : 'Delete product is unsuccessful',
  })
})

//* upload Images Model Design
export const uploadImagesModelDesign = asyncHandler(async (req, res) => {
  const { _id } = req.params

  if (!req.files) throw new Error('Missing input')

  const path = req.files.map(el => el.path)

  const response = await Modeldesign.findByIdAndUpdate(
    _id,
    { $push: { images: { $each: path } } },
    { new: true },
  )

  return res.status(200).json({
    status: response ? true : false,
    newModelDesign: response ? response : ' Cannot upload images product',
  })
})

//* upload Thumbnail Model Design
export const uploadThumbnailModelDesign = asyncHandler(async (req, res) => {
  const { _id } = req.params

  if (!req.file) throw new Error('Missing input')

  const path = req.file.path

  const response = await Modeldesign.findByIdAndUpdate(
    _id,
    { $push: { thumbnail: path } },
    { new: true },
  )

  return res.status(200).json({
    status: response ? true : false,
    newModelDesign: response ? response : ' Cannot upload images product',
  })
})
