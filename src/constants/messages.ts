export const RESPONSE_MESSAGES = {
  // Success
  SUCCESS: 'Request successful',
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',

  // Auth
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SIGNUP_SUCCESS: 'Registration successful',
  PASSWORD_RESET_SUCCESS: 'Password reset successful',
  PASSWORD_CHANGED: 'Password changed successfully',

  // Errors
  INTERNAL_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  BAD_REQUEST: 'Bad request',
  CONFLICT: 'Resource already exists',
  VALIDATION_ERROR: 'Validation error',

  // User
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_NOT_VERIFIED: 'Email not verified',

  // Products
  PRODUCT_NOT_FOUND: 'Product not found',
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',

  // Orders
  ORDER_NOT_FOUND: 'Order not found',
  ORDER_CREATED: 'Order created successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  INVALID_ORDER_STATUS: 'Invalid order status',

  // Subscriptions
  SUBSCRIPTION_NOT_FOUND: 'Subscription not found',
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully',
};

export const ERROR_CODES = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  USERNAME_ALREADY_EXISTS: 'USERNAME_ALREADY_EXISTS',
};
