import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '@common/utils/response';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(
      {
        body: req.body,
        params: req.params,
        query: req.query,
      },
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message.replace(/"/g, "'"),
      }));

      return next(new AppError(StatusCodes.UNPROCESSABLE_ENTITY, 'Validation failed', details));
    }

    req.body = value.body;
    req.params = value.params;
    req.query = value.query;

    next();
  };
};
