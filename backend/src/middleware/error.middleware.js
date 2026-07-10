const ApiError = require('../utils/ApiError');

// 404 handler for unmatched routes.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Centralized error handler. Any error passed to next(err), or thrown inside
// an asyncHandler-wrapped controller, ends up here.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // better-sqlite3 throws raw SqliteError instances (e.g. on a UNIQUE
  // violation from a race condition) — never leak their internal message.
  if (err.code && err.code.startsWith('SQLITE_CONSTRAINT')) {
    return res.status(409).json({ message: 'This record conflicts with existing data.' });
  }

  const status = err instanceof ApiError ? err.status : err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status === 500) {
    console.error(err.stack);
  }

  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
