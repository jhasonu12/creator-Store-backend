import Joi from 'joi';

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
    slug: Joi.string().min(1).max(100).required(),
    type: Joi.string()
      .valid('digital-download', 'course', 'subscription', 'checkout', 'upsell', 'thank-you')
      .required(),
    productId: Joi.string().uuid().optional(),
    data: Joi.object().optional(),
    position: Joi.number().integer().min(0).optional(),
  }),
});

export const updatePageSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    slug: Joi.string().min(1).max(100).optional(),
    type: Joi.string()
      .valid('digital-download', 'course', 'subscription', 'checkout', 'upsell', 'thank-you')
      .optional(),
    productId: Joi.string().uuid().optional(),
    data: Joi.object().optional(),
  }),
});

export const reorderPagesSchema = Joi.object({
  params: Joi.object({
    storeId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    pages: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().uuid().required(),
          position: Joi.number().integer().min(0).required(),
        })
      )
      .required(),
  }),
});

// ========== PAGE BLOCKS (Sales Builder) ==========

export const createBlockSchema = Joi.object({
  params: Joi.object({
    pageId: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid(
        'hero',
        'testimonial',
        'faq',
        'pricing',
        'countdown',
        'guarantee',
        'video',
        'checkout_button',
        'text',
        'image',
        'divider'
      )
      .required(),
    data: Joi.object().required(),
    position: Joi.number().integer().min(0).optional(),
  }),
});

export const updateBlockSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    type: Joi.string()
      .valid(
        'hero',
        'testimonial',
        'faq',
        'pricing',
        'countdown',
        'guarantee',
        'video',
        'checkout_button',
        'text',
        'image',
        'divider'
      )
      .optional(),
    data: Joi.object().optional(),
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
