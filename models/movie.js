"user strict"

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
} = require("../expressError");

/** Functions for movies. */

class Movie {
  /** Get a movie from the db
   * @param movie_id integer
   * @returns { movie_id, title }
   * 
   * Throws NotFoundError if movie not found.
   */

  static async getMovie(movie_id) {
    const movieRes = await db.query(
          `SELECT movie_id,
                  title,
                  positive,
                  negative
          FROM ratings
          WHERE movie_id = $1`,
          [movie_id],
    );

    const movie = movieRes.rows[0];

    if (!movie) throw new NotFoundError(`No movie with ID: ${movie_id}`);

    return movie;
  }

  /** Get all movies
   * 
   * @returns [{movie}, {movie}, ...] where movie is:
   *          {movie_id, title, positive, negative, release_date}
   * 
   * No route calls this yet.
   */
  static async getAllMovies() {
    const moviesRes = await db.query(
          `SELECT movie_id,
                  title,
                  positive,
                  negative,
                  release_date,
                  poster_path
           FROM ratings
           ORDER BY title`
      );
      const movies = moviesRes.rows

      if (movies.length < 1) throw new NotFoundError('No movies in DB');

      return movies;
  }


  /** Add a vote to a movie
   * @param movie_id integer
   * @param vote string: "positive" or "negative"
   * @returns { title, positive, negative }
   * 
   * Throws NotFoundError if movie not found.
   */

  static async addVote({ movie_id, rating }) {
    if (rating !== "positive" && rating !== "negative") {
      throw new BadRequestError(`${rating} is an invalid rating.`);
    }

    // Check to see if movie is already in db.
    const movieRes = await db.query(
          `SELECT *
          FROM ratings
          WHERE movie_id = $1`,
          [movie_id],
    );
    const movie = movieRes.rows[0];

    if (!movie) throw new NotFoundError(`No movie with ID: ${movie_id}`);
    // TODO Find out why I can't use $ notation to make set values variable in value array.
    const voteRes = await db.query(
          `UPDATE ratings
          SET ${rating} = ${rating} + 1
          WHERE movie_id = $1
          RETURNING title,
                    positive,
                    negative`,
          [movie_id],
    );
    const vote = voteRes.rows[0];

    return vote;
  }

  /** Add a movie to the collection
   * @param movie {object} { movie_id, title, release_date, poster_path }
   * @returns { movie_id, title, release_date }
   * 
   * Throws BadRequestError if movie already in db.
   */

  static async addMovie({ movie_id, positive, negative, title, release_date, poster_path }) {
    const duplicateCheck = await db.query(
          `SELECT title
          FROM ratings
          WHERE movie_id = $1`,
        [movie_id]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate movie: ${title}`);
    }

    const result = await db.query(
          `INSERT INTO ratings
          (movie_id,
           positive,
           negative,
           title,
           release_date,
           poster_path)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING movie_id, title`,
        [
          movie_id,
          positive,
          negative,
          title,
          release_date,
          poster_path,
        ]
    );
    
    const movie = result.rows[0];

    return movie;
  }

  /** Remove a movie from the collection
   * @param movie_id integer
   * 
   * Not yet implemented on front end.
   */
  static async removeMovie(movie_id) {
    const result = await db.query(
      `DELETE FROM ratings
      WHERE movie_id = $1
      RETURNING *`,
      [movie_id]
    );

    const confirmation = result.rows[0];

    return confirmation;
  }
}

module.exports = Movie;