"user strict"

/** Routes for rating movies. */

const express = require("express");
const Movie = require("../models/movie");

const router = express.Router({ mergeParams: true });
  

// This temporary route will be replaced by front end page.
router.get("/", async function (req, res, next) {
  try {
    // Api call to get some movies goes here
    return res.send('<h2>Backend routes! Nothing else here, try "/all"</h2>')
  } catch (err) {
    return next(err);
  }
});


/** GET / () => [{movie}, {movie}, ...] */
router.get("/all", async function (req, res, next) {
  try {
    const movies = await Movie.getAllMovies();
    return res.status(200).json({ movies })
  } catch (err) {
    if (err.message === "No movies in DB") {
      return res.status(200).json({movies: []});
    }
    return next(err);
  }
});


/** GET / { movie_id } => { movie_id, title } */
router.get("/:movie_id", async function (req, res, next) {
  try {
    const movie = await Movie.getMovie(+req.params.movie_id);
    return res.status(200).json({ movie });
  } catch (err) {
    return next(err);
  }
});


/** POST / { movie } => { movie_id }
 *  
 * Ratings set to 0 by default on insertion
 * 
 * Returns { movie_id, title }
 */
router.post("/add", async function (req, res, next) {
  try {
    const movie = await Movie.addMovie(req.body.params);
    return res.status(201).json({ movie });
  } catch(err) {
    return next(err);
  }
});


/** POST / { rating, movie } => { rating } OR { rating, movie }
 * 
 * incoming data should be { rating, movie_id,}
 * 
 * Returns { title, positive, negative }
 */
router.post("/rate", async function (req, res, next) {
  try {
      const ratings = await Movie.addVote(req.body.params);
      return res.status(200).json({ ratings });
    } catch (err) {
      return next(err);
  }
});


  module.exports = router;
// When voting and searching for a movie, remember to send movie_id as an integer!
