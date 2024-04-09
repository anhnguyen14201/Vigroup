import express from 'express'
import { createOrder } from '../controllers/order'
import { checkPermission } from '../middlewares/checkPermission'

const routerOrder = express.Router()

routerOrder.get('/', [checkPermission], createOrder)

export default routerOrder
