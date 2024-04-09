import express from 'express'

import uploadCloud from '../config/cloudinary.config'
import { createSlider, getSlider } from '../controllers/slider'

const routerSlider = express.Router()

routerSlider.post('/', uploadCloud.single('image'), createSlider)
routerSlider.get('/', getSlider)
//routerSlider.put('/', uploadCloud.array('image'), uploadImagesSlider)

export default routerSlider
