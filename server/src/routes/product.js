import express from 'express'
import {
  createProduct,
  getAProduct,
  getProducts,
  removeProduct,
  updateProduct,
  uploadImagesProduct,
} from '../controllers/product'
import { checkPermission, isAdmin } from '../middlewares/checkPermission'
import uploadCloud from '../config/cloudinary.config'

const routerProduct = express.Router()

routerProduct.post('/', [checkPermission, isAdmin], createProduct)

routerProduct.get('/', getProducts)
routerProduct.get('/:_id', getAProduct)

routerProduct.put(
  '/uploadimage/:_id',
  [checkPermission, isAdmin],
  uploadCloud.array('image'),
  uploadImagesProduct,
)
routerProduct.put('/:_id', [checkPermission, isAdmin], updateProduct)

routerProduct.delete('/:_id', [checkPermission, isAdmin], removeProduct)

export default routerProduct
