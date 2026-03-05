import Joi from 'joi';
import { ProductType, ProductStatus, StyleType } from '@models/Product';

// ========== PRODUCTS ==========

export const createProductSchema = Joi.object({
  body: Joi.object({
    type: Joi.string()
      .valid(...Object.values(ProductType))
      .required(),
    title: Joi.string().min(3).max(200).required(),
    thumbnailUrl: Joi.string().uri().optional().allow(null),
    displayStyle: Joi.string()
      .valid(...Object.values(StyleType))
      .optional()
      .default(StyleType.BUTTON),
    ctaButtonText: Joi.string().min(1).max(100).optional().default('Get Access'),
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
    thumbnailUrl: Joi.string().uri().optional().allow(null),
    displayStyle: Joi.string()
      .valid(...Object.values(StyleType))
      .optional(),
    ctaButtonText: Joi.string().min(1).max(100).optional(),
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
