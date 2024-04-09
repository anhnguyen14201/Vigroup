import Joi from 'joi'

export const productValidation = Joi.object({
  productName: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'productName không được để trống',
    'any.required': 'productName là bắt buộc',
    'string.min': ' productName có ít nhất {#litmit} ký tự',
    'string.max': ' productName có ít hơn {#litmit + 1} ký tự',
  }),
  price: Joi.number().required().messages({
    'number.empty': 'price không được để trống',
    'any.required': 'price là bắt buộc',
    'number.base':
      'The value is not a number or could not be cast to a number.',
  }),
  desc: Joi.string(),
  categoryId: Joi.string(),
})
