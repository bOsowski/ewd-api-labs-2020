import express from 'express';
import {
  getMovies, getMovie, getMovieReviews, getMovieVideos, getMovieCredits
} from '../tmdb-api';
import wrap from 'express-async-wrapper';

const router = express.Router();

router.get('/', (req, res) => {
  getMovies().then(movies => res.status(200).send(movies));
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovie(id).then(movie => res.status(200).send(movie));
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(results => res.status(200).send(results))
});

router.get('/:id/reviews', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieReviews(id)
  .then(results => res.status(200).send(results))
});

router.get('/:id/credits', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieCredits(id)
  .then(results => res.status(200).send(results))
});


router.get('/:id/videos', (req, res, next) => {
  const id = parseInt(req.params.id);
  getMovieVideos(id)
  .then(results => res.status(200).send(results))
});

router.post('/:id/reviews', (req, res) => {
  const id = parseInt(req.params.id);
  getMovie(id).then(movie => {
    movie.reviews.push(req.body)
    movie.save().then(res.status(200).send(movie.reviews))});
});

export default router;
