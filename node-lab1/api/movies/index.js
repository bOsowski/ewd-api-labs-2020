import express from 'express';
import {movieObject} from './movies';

const router = express.Router(); // eslint-disable-line
router.get('/', (req, res) => {
  res.send(movieObject);
});

router.post('/', (req, res) => {
  let newMovie = req.body;
  if (newMovie && newMovie.title) {
    //Adds a random id if missing. 
    !newMovie.id ? newMovie.id = Math.round(Math.random() * 10000) : newMovie 
    movieObject.movies.push(newMovie);
    res.status(201).send(newMovie);
  } else {
    res.status(405).send({
      message: "Invalid Movie Data",
      status: 405
    });
  }
});

// Update a movie
router.put('/:id', (req, res) => {
  const key = parseInt(req.params.id);
  const updateMovie = req.body;
  const index = movieObject.movies.map((movie) => {
    return movie.id;
  }).indexOf(key);
  if (index !== -1) {
    !updateMovie.id ? updateMovie.id = key : updateMovie
    movieObject.movies.splice(index, 1, updateMovie);
    res.status(200).send(updateMovie);
  } else {
    res.status(404).send({
      message: 'Unable to find Movie',
      status: 404
    });
  }
});

// Delete a movie
router.delete('/:id', (req, res) => {
  const key =  parseInt(req.params.id);
  const index = movieObject.movies.map((movie)=>{
return movie.id;
}).indexOf(key);
 if (index > -1) {
  movieObject.movies.splice(index, 1);
     res.status(200).send({message: `Deleted movie id: ${key}.`,status: 200});
 } else {
   res.status(404).send({message: `Unable to find movie with id: ${key}.`, status: 404});
   }
});

export default router;
