/**
 * Centralized error handler. Any error passed to next(err) anywhere in the
 * app (route handlers, controllers, services) ends up here.
 *
 * Recognizes:
 * - errors with an explicit `status` (thrown deliberately by controllers)
 * - Mongoose CastError (malformed ids) -> 400
 * - Mongoose ValidationError -> 400
 * - Mongo duplicate key errors -> 409
 * - everything else -> 500, without leaking internals to the client
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error(err);

  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid identifier supplied';
  }

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors || {})
      .map((validationError) => validationError.message)
      .join(', ') || 'Validation failed';
  }

  if (err.code === 11000) {
    status = 409;
    message = 'A record with the same unique field already exists';
  }

  if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoNetworkError') {
    status = 503;
    message = 'Could not reach the database. Please try again shortly.';
  }

  res.status(status).json({
    success: false,
    error: message,
  });
}

/**
 * Catches requests to routes that don't exist and forwards a 404 error
 * into the same errorHandler above, rather than falling through to
 * Express's default HTML error page.
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

module.exports = { errorHandler, notFoundHandler };
