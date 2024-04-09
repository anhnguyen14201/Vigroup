import Joi from 'joi'

export const signUpValidator = Joi.object({
  firstName: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'firstName không được để trống',
    'any.required': 'firstName là bắt buộc',
    'string.min': ' firstName có ít nhất {#litmit} ký tự',
    'string.max': ' firstName có ít hơn {#litmit + 1} ký tự',
  }),

  lastName: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'lastName không được để trống',
    'any.required': 'lastName là bắt buộc',
    'string.min': ' lastName có ít nhất {#litmit} ký tự',
    'string.max': ' lastName có ít hơn {#litmit + 1} ký tự',
  }),

  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng',
  }),
  password: Joi.string().required().min(6).max(255).messages({
    'string.empty': 'password không được để trống',
    'any.required': 'password là bắt buộc',
    'string.min': ' password có ít nhất {#litmit} ký tự',
    'string.max': ' password có ít hơn {#litmit + 1} ký tự',
  }),
  confirmPassword: Joi.string()
    .required()
    .min(6)
    .max(255)
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'confirmPassword không được để trống',
      'any.required': 'confirmPassword là bắt buộc',
      'string.min': ' confirmPassword có ít nhất {#litmit} ký tự',
      'string.max': ' confirmPassword có ít hơn {#litmit + 1} ký tự',
      'any.only': 'confirmPassword không khớp với password',
    }),
  role: Joi.string(),
})

export const signInValidator = Joi.object({
  email: Joi.string().required().email().messages({
    'string.empty': 'Email không được để trống',
    'any.required': 'Email là bắt buộc',
    'string.email': 'Email không đúng định dạng',
  }),
  password: Joi.string().required().min(6).max(255).messages({
    'string.empty': 'Password không được để trống',
    'any.required': 'Password là bắt buộc',
    'string.min': ' Password có ít nhất {#litmit} ký tự',
    'string.max': ' Password có ít hơn {#litmit + 1} ký tự',
  }),
})
