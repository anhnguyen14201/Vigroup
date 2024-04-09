import express from 'express'
import routerProduct from './product'
import routerCategory from './category'
import routerAuth from './auth'
import routerOrder from './order'
import routerSlider from './slider'
import routerModelDesign from './modeldesign'

const router = express.Router()

router.use('/auth', routerAuth)

router.use('/product', routerProduct)

router.use('/category', routerCategory)

router.use('/order', routerOrder)

router.use('/slider', routerSlider)

router.use('/model-design', routerModelDesign)

export default router
