import express from 'express';
import User from './userModel';
import Movie from './../movies/movieModel'

const router = express.Router(); // eslint-disable-line

// Get all users
router.get('/', (req, res, next) => {
    User.find().then(users =>  res.status(200).json(users)).catch(next);
});

// register
// authenticate a user
router.post('/', (req, res, next) => {
  if (!req.body.username || !req.body.password) {
      res.status(401).send('authentication failed');
  } else {
      User.findByUserName(req.body.username).then(user => {
          if (user.comparePassword(req.body.password)) {
              req.session.user = req.body.username;
              req.session.authenticated = true;
              res.status(200).json({
                  success: true,
                  token: "temporary-token"
                });
          } else {
              res.status(401).json('authentication failed');
          }
      }).catch(next);
  }

});

// Update a user
router.put('/:id',  (req, res, next) => {
    if (req.body._id) delete req.body._id;
     User.update({
      _id: req.params.id,
    }, req.body, {
      upsert: false,
    })
    .then(user => res.json(200, user)).catch(next);
});

router.post('/:userName/favourites', (req, res, next) => {
    const newFavourite = req.body;
    const userName = req.params.userName;
    if (newFavourite && newFavourite.id) {
        Movie.findOneAndUpdate({id: newFavourite.id},newFavourite,{new:true,upsert:true}).then(movie => {
            User.findByUserName(userName).then(
                    (user) => {
                       (user.favourites.indexOf(movie._id)>-1)?user:user.favourites.push(movie._id.toString());
                       user.save().then(user => res.status(201).send(user))
                      }
            );
            }).catch(next);
    } else {
        res.status(401).send("unable")
    }
  });

router.get('/:userName/favourites', (req, res, next) => {
    const userName = req.params.userName;
    User.findByUserName(userName).populate('favourites').then(
        user => res.status(201).send(user.favourites)
    ).catch(next)
});

export default router;