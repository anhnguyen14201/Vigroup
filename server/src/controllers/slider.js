import asyncHandler from 'express-async-handler'
import Slider from '../models/Slider'

/* export const uploadImagesSlider = asyncHandler(async (req, res) => {
  if (!req.files) throw new Error('Missing input')

  const path = req.files.map(el => el.path)

  const response = await Slider.findByIdAndUpdate(
    { $push: { images: { $each: path } } },
    { new: true },
  )

  return res.status(200).json({
    status: response ? true : false,
    updateProduct: response ? response : ' Cannot upload images product',
  })
})
 */
export const createSlider = asyncHandler(async (req, res) => {
  if (!req.file || req.file.path === 0) throw new Error('Missing input')

  const path = req.file.path

  const newImage = new Slider({ image: path })
  await newImage.save()

  return res.status(200).json({
    status: newImage ? true : false,
    slider: newImage ? newImage : ' Cannot upload images product',
  })
})

export const getSlider = asyncHandler(async (req, res) => {
  const sliderPath = await Slider.find({})

  return res.status(200).json({
    success: sliderPath ? true : false,
    sliderPath: sliderPath ? sliderPath : 'Cannot get a detail category',
  })
})
