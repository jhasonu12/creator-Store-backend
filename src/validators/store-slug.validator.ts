import Joi from 'joi';

export const checkSlugAvailabilitySchema = Joi.object({
  query: Joi.object({
    slug: Joi.string()
      .min(3)
      .max(30)
      .pattern(/^[a-z0-9-]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Slug can only contain lowercase letters, numbers, and hyphens',
        'string.min': 'Slug must be at least 3 characters long',
        'string.max': 'Slug must be at most 30 characters long',
        'any.required': 'Slug is required',
      }),
  }),
});
