import Joi from 'joi'

export const modelDesignValidation = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'totalArea không được để trống',
    'any.required': 'totalArea là bắt buộc',
    'string.min': ' totalArea có ít nhất {#litmit} ký tự',
    'string.max': ' totalArea có ít hơn {#litmit + 1} ký tự',
  }),

  desc: Joi.string(),
})
