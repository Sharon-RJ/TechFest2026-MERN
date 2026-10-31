
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Duplicate value error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `${field} already exists`
      : "Duplicate value";
  }

  // Invalid JSON request body
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal Server Error"
        : message
  });
};

module.exports = errorHandler;
