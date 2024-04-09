import Joi from 'joi'

export const categoryValidation = Joi.object({
  categoryName: Joi.string().required().min(3).max(255).messages({
    'string.empty': 'categoryName không được để trống',
    'any.required': 'categoryName là bắt buộc',
    'string.min': ' categoryName có ít nhất {#litmit} ký tự',
    'string.max': ' categoryName có ít hơn {#litmit + 1} ký tự',
  }),
})
