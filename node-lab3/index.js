import session from 'express-session';
import authenticate from './authenticate';
import './db'
import usersRouter from './api/users';
import {loadUsers, removeFavourites} from './seedData'
import dotenv from 'dotenv';
import express from 'express';
import genresRouter from './api/genres/index';
import moviesRouter from './api/movies/index';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs'
import passport from './authenticate';

dotenv.config();

const app = express();
const port = process.env.PORT;
const swaggerDocument = YAML.load('./../movie-api-yaml/swagger.yaml');

if(process.env.seedDb){
	loadUsers();
	removeFavourites();
}

const errorHandler=(err,req,res,next)=>{
  console.log(err);
  res.status(500).json({status: 500, message:"Internal Server Error"});
}

//configure body-parser
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static('public'));

//session middleware
app.use(session({
  secret: 'ilikecake',
  resave: true,
  saveUninitialized: true
}));

app.use('/api/movies', passport.authenticate('jwt', {session: false}), moviesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/users', usersRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.info(`Server running at ${port}`);
});
