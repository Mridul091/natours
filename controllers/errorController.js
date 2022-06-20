const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleJWTError = (err) =>
  new AppError('Invalid Token. Please login again', 401);

const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired! Please login again');

const handleDuplicateDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)[0];
  const message = `Duplicate Field Value: ${value}, Use another value`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const devError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    console.log('ERROR 😱', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

// const haldeDuplicates = err =>{
//   const value = err.
// }

const prdError = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    //API
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      console.log('ERROR 😱', err);

      return res.status(500).json({
        status: 'error',
        message: 'Someting went Wrong!!',
      });
    }
  } else {
    //RENDERED WEBSITE
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: err.message,
      });
    } else {
      console.log('ERROR 😱', err);

      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong',
        msg: 'Please try again latter',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  //   console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    devError(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = Object.assign(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);
    prdError(error, req, res);
  }
};
