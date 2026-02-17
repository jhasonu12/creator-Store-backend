import Joi from 'joi';

export const createUserSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
  }),
});

export const creatorSignupSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    slug: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().required(),
    timezone: Joi.string().optional().default('UTC'),
    countryCode: Joi.string().optional().length(2),
  }),
});

export const refreshTokenSchema = Joi.object({
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
});

export const updateUserSchema = Joi.object({
  body: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    bio: Joi.string().optional(),
    avatar: Joi.string().uri().optional(),
  }),
});

export const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

export const paginationSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).max(100).optional(),
  }),
});
