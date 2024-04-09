import express from 'express'
import {
  forgotPassword,
  getUser,
  getUsers,
  logOut,
  refreshAccessToken,
  resetPassword,
  signIn,
  signUp,
  updateByAdmin,
  updateCart,
  updateUser,
} from '../controllers/auth'
import { checkPermission, isAdmin } from '../middlewares/checkPermission'

const routerAuth = express.Router()

routerAuth.post('/signup', signUp)
routerAuth.post('/signin', signIn)
routerAuth.post('/refresh', refreshAccessToken)

routerAuth.get('/logout', logOut)
routerAuth.get('/forgotpassword', forgotPassword)
routerAuth.get('/', [checkPermission, isAdmin], getUsers)
routerAuth.get('/current', [checkPermission], getUser)

routerAuth.put('/resetpassword', [checkPermission], resetPassword)
routerAuth.put('/updatecart', [checkPermission], updateCart)
routerAuth.put('/current', [checkPermission], updateUser)
routerAuth.put('/:_id', [checkPermission, isAdmin], updateByAdmin)

export default routerAuth
