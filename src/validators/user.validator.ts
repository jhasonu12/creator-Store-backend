import Joi from 'joi';

export const createUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username can only contain letters and numbers',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
      }),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
  }),
});

export const creatorSignupSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.alphanum': 'Username can only contain letters and numbers',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot exceed 30 characters',
        'any.required': 'Username is required',
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters',
        'any.required': 'Password is required',
      }),
    slug: Joi.string()
      .pattern(/^[a-z0-9-]+$/)
      .min(3)
      .max(30)
      .required()
      .messages({
        'string.pattern.base': 'Store slug can only contain lowercase letters, numbers, and hyphens',
        'string.min': 'Store slug must be at least 3 characters',
        'string.max': 'Store slug cannot exceed 30 characters',
        'any.required': 'Store slug is required',
      }),
    fullName: Joi.string()
      .trim()
      .required()
      .messages({
        'string.empty': 'Full name cannot be empty',
        'any.required': 'Full name is required',
      }),
    timezone: Joi.string().optional().default('UTC'),
    countryCode: Joi.string()
      .length(2)
      .optional()
      .messages({
        'string.length': 'Country code must be 2 characters (e.g., US, UK)',
      }),
  }),
});

export const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token is required',
      }),
  }),
});

export const updateUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().uri().optional(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required',
      }),
  }),
});

export const paginationSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
  }),
});
