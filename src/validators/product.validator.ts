import Joi from 'joi';
import { ProductType, ProductStatus } from '@models/Product';

// ========== PRODUCTS ==========

export const createProductSchema = Joi.object({
  body: Joi.object({
    type: Joi.string()
      .valid('DIGITAL', 'COURSE', 'SUBSCRIPTION')
      .required(),
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    price: Joi.number().min(0).required(),
    currency: Joi.string().length(3).optional().default('USD'),
    thumbnailUrl: Joi.string().uri().optional(),
  }).required(),
});

export const updateProductSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid(...Object.values(ProductType))
      .optional(),
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().length(3).optional(),
    thumbnailUrl: Joi.string().uri().optional(),
    status: Joi.number()
      .valid(...Object.values(ProductStatus))
      .optional(),
  }).required(),
});

export const getProductSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
});

export const deleteProductSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
});

export const updateStatusSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    status: Joi.number()
      .valid(...Object.values(ProductStatus))
      .required(),
  }).required(),
});

export const reorderProductsSchema = Joi.object({
  body: Joi.object({
    products: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().uuid().required(),
          position: Joi.number().integer().min(0).required(),
        })
      )
      .min(1)
      .required(),
  }).required(),
});
