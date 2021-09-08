"user strict";

/** Shared config for application; can be required many places */

require("dotenv").config();
require("colors");

// Example of image src path:
// https://www.themoviedb.org/t/p/w220_and_h330_face/wwFBRyekDcKXJwP0mImRJjAnudL.jpg

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

// Choose proper database based on context (dev, testing, or production)
function getDatabaseUri() {
  return (process.env.NODE_ENV === "test")
      ? "ratorly_test"
      : process.env.DATABASE_URL || "ratorly";
}

console.log("Jobly Config:".green);
console.log("SECRET_KEY".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  getDatabaseUri,
};
