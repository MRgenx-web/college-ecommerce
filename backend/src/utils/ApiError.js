// Custom error class carrying an HTTP status code, so the centralized
// error middleware can respond with the right status instead of a bare 500.
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = ApiError;
