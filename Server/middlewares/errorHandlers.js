function errorHandler(err, req, res, next) {
//   console.log(err, "<<< ini error handler di app.js");
  let status = 500;
  let message = "Internal Server Error";

  console.log(err, '<<<<');
  if (err.name === "unauthenticated" || err.name === "JsonWebTokenError") {
    status = 401;
    message = err.name;
    res.status(status).json({ message });
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    status = 400;
    message = err.errors[0].message;
    res.status(status).json({ message });
  } else if (err.name === "badRequest" || err.name === "unauthenticated") {
    status = 400;
    message = err.name;
    res.status(status).json({ message });
  } else if (err.name === "movieNotFound") {
    status = 404;
    message = "Movie not found";
    res.status(status).json({ message });
  } else if (err.name === "genreNotFound") {
    status = 404;
    message = err.error;
    res.status(status).json({ message });
  } else if (err.name === "not found") {
    status = 404;
    message = `Movie with id ${err.id} not found`;
    res.status(status).json({ message });
  } else if (err.name === "forbidden") {
    status = 403;
    message = "Forbidden";
    res.status(status).json({ message });
  } 
  
  res.status(status).json({ message });
}

module.exports = errorHandler;
