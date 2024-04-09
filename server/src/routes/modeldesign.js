import express from 'express'

import { checkPermission, isAdmin } from '../middlewares/checkPermission'
import uploadCloud from '../config/cloudinary.config'
import {
  createModelDesign,
  getAModelDesign,
  getModelDesigns,
  removeModelDesign,
  updateModelDesign,
  uploadImagesModelDesign,
  uploadThumbnailModelDesign,
} from '../controllers/modeldesign'

const routerModelDesign = express.Router()

routerModelDesign.post('/', createModelDesign)

routerModelDesign.get('/', getModelDesigns)
routerModelDesign.get('/:_id', getAModelDesign)

routerModelDesign.put(
  '/uploadimage/:_id',
  uploadCloud.array('image'),
  uploadImagesModelDesign,
)

routerModelDesign.put(
  '/uploadthumbnail/:_id',
  uploadCloud.single('thumbnail'),
  uploadThumbnailModelDesign,
)

routerModelDesign.put('/:_id', updateModelDesign)

routerModelDesign.delete('/:_id', removeModelDesign)

export default routerModelDesign
