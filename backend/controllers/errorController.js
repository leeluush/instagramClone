const AppError = require('../middleware/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const fieldValue = err.keyValue[fieldName];

  const message = `Duplicate field value: ${fieldValue}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${errors.join(', ')}`;
  return new AppError(message, 400);
};

const handleJWTError = new AppError('Invaild token. please log in again!', 401);

const handleTokenExpiredErrorDB = new AppError(
  'Your token has expired. Please log in agian.',
  404,
);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// const sendErrorProd = (err, res) => {
//   // Operational, trusted error: send message to client
//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });

//     // Programming or other unknown error: don't leak error details
//   } else {
//     // 1) Log error
//     console.error('ERROR 💥', err);

//     // 2) Send genric message to client
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong',
//     });
//   }
// };

const sendErrorProd = (err, res) => {
  // First log the error to the console
  console.error('ERROR 💥', {
    message: err.message,
    stack: err.stack,
    err: JSON.stringify(err, Object.getOwnPropertyNames(err)),
  });

  // Then decide on what to send to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Send a generic message to the client
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredErrorDB();
    }

    sendErrorProd(error, res);
  }
};
