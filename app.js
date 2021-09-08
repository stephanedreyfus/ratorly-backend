"use strict";

/** Express app for ratorly */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const movieRoutes = require("./routes/movies");

const morgan = require("morgan")

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/movies", movieRoutes);

app.get("/", function (req, res, next) {
  return res.send('<h1>Welcome to Ratorly! Things still under construction.</h1>');
});

/** Handle 404 errors --  this matches everything*/
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handlerl; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
