import Joi from 'joi';


/**
 * Form configuration schema for lead capture
 */
const formConfigSchema = Joi.object({
  collectName: Joi.boolean().required(),
  collectEmail: Joi.boolean().required(),
}).required();

/**
 * Digital asset schema for downloadable files
 */
const digitalAssetSchema = Joi.object({
  url: Joi.string().uri().required(),
  name: Joi.string().min(1).max(200).required(),
  assetType: Joi.string().valid('file', 'link').required(),
}).required();
/**
 * Validation schema for StorePage.data JSON field
 * Ensures consistent structure for page-specific configuration and pricing
 */
const pageDataSchema = Joi.object({
  // Page metadata (required)
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().optional(),
  
  // Pricing information
  price: Joi.number().min(0).precision(2).optional(),
  currency: Joi.string().length(3).optional(), // ISO 4217 currency code (e.g., 'USD')
  discountPrice: Joi.number().min(0).precision(2).allow(null).optional(),
  isDiscountPriceAvailable: Joi.boolean().optional(),
  
  // Form configuration
  form: formConfigSchema.optional(),
  
  // Digital assets
  digitalAssets: Joi.array().items(digitalAssetSchema).optional(),
  
  // Allow additional fields for flexibility
}).unknown(true);

export const updatePageSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid('digital-download', 'course', 'subscription', 'checkout', 'upsell', 'thank-you')
      .optional(),
    productId: Joi.string().uuid().optional(),
    data: pageDataSchema.optional(),
  }),
});



// ========== PAGE BLOCKS (Reviews & FAQs) ==========

/**
 * Data schema for testimonial/review block
 */
const testimonialBlockDataSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  image: Joi.string().uri().optional(),
  content: Joi.string().min(10).max(1000).required(),
  rating: Joi.number().min(1).max(5).optional(),
}).required();

/**
 * Data schema for FAQ block
 */
const faqBlockDataSchema = Joi.object({
  question: Joi.string().min(5).max(300).required(),
  answer: Joi.string().min(10).max(2000).required(),
}).required();

export const createBlockSchema = Joi.object({
  params: Joi.object({
    pageId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid('testimonial', 'faq')
      .required(),
    data: Joi.when('type', {
      switch: [
        {
          is: 'testimonial',
          then: testimonialBlockDataSchema,
        },
        {
          is: 'faq',
          then: faqBlockDataSchema,
        },
      ],
      otherwise: Joi.object().required(),
    }),
    position: Joi.number().integer().min(0).optional(),
  }),
});

export const updateBlockSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid('testimonial', 'faq')
      .optional(),
    data: Joi.when('type', {
      switch: [
        {
          is: 'testimonial',
          then: testimonialBlockDataSchema,
        },
        {
          is: 'faq',
          then: faqBlockDataSchema,
        },
      ],
      otherwise: Joi.object().optional(),
    }),
  }),
});

export const reorderBlocksSchema = Joi.object({
  params: Joi.object({
    pageId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    blocks: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().uuid().required(),
          position: Joi.number().integer().min(0).required(),
        })
      )
      .required(),
  }),
});