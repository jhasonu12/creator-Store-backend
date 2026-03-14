import Joi from 'joi';

// ========== PAGE DATA SCHEMA ==========
/**
 * Form configuration schema for lead capture
 */
const formConfigSchema = Joi.object({
  collectName: Joi.boolean().default(true),
  collectEmail: Joi.boolean().default(true),
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
  
  // Allow additional fields for flexibility
}).unknown(true);

// ========== STORE ==========

export const createStoreSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500).optional(),
    type: Joi.string().valid('linksite', 'funnel', 'hybrid').optional(),
  }),
});

export const updateStoreSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    name: Joi.string().min(1).max(100).optional(),
    description: Joi.string().max(500).optional(),
    type: Joi.string().valid('linksite', 'funnel', 'hybrid').optional(),
  }),
});

// ========== SECTIONS (Link-in-bio) ==========

export const createSectionSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid(
        'title',
        'product_link',
        'external_link',
        'course_card',
        'divider',
        'image',
        'social_links',
        'email_capture'
      )
      .required(),
    data: Joi.object().required(),
    position: Joi.number().integer().min(0).optional(),
  }),
});

export const updateSectionSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid(
        'title',
        'product_link',
        'external_link',
        'course_card',
        'divider',
        'image',
        'social_links',
        'email_capture'
      )
      .optional(),
    data: Joi.object().optional(),
  }),
});

export const reorderSectionsSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    sections: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().uuid().required(),
          position: Joi.number().integer().min(0).required(),
        })
      )
      .required(),
  }),
});

// ========== PAGES (Product Landing Pages) ==========

export const createPageSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid('digital-download', 'course', 'subscription', 'checkout', 'upsell', 'thank-you')
      .required(),
    productId: Joi.string().uuid().required(),
    data: pageDataSchema.required(),
    form: formConfigSchema.optional(),
    digitalAssets: Joi.array().items(digitalAssetSchema).optional(),
  }),
});

// ========== THEME ==========

export const updateThemeSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    config: Joi.object({
      primaryColor: Joi.string().optional(),
      secondaryColor: Joi.string().optional(),
      fontFamily: Joi.string().optional(),
      fontSize: Joi.string().optional(),
      borderRadius: Joi.string().optional(),
      buttonStyle: Joi.string().optional(),
    }).required(),
  }),
});
