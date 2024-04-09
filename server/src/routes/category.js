import express from 'express'
import {
  createCategory,
  getACategory,
  getCategory,
  removeCategory,
  updateCategory,
} from '../controllers/category'
import { checkPermission, isAdmin } from '../middlewares/checkPermission'

const routerCategory = express.Router()

routerCategory.post('/', [checkPermission, isAdmin], createCategory)

routerCategory.get('/', getCategory)
routerCategory.get('/:_id', getACategory)

routerCategory.put('/:_id', [checkPermission, isAdmin], updateCategory)

routerCategory.delete('/:_id', [checkPermission, isAdmin], removeCategory)

export default routerCategory
