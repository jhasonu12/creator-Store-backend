import Joi from 'joi';

export const createProductSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isDigital: Joi.boolean().optional(),
    stock: Joi.number().min(0).optional(),
  }),
});

export const updateProductSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('draft', 'published', 'archived').optional(),
    stock: Joi.number().min(0).optional(),
  }),
});
