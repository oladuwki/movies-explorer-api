const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');
const errorHandle = (err, next) => {
  if (err.name === 'ValidationError') {
    throw new BadRequestError('Ошибка обработки запроса');
  } if (err.name === 'CastError') {
    throw new BadRequestError('Ошибка обработки запроса');
  } if (err.name === 'MongoError' && err.code === 11000) {
    throw new ConflictError('Адрес электронной почты уже используется');
  }
  next(err);
};
const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate('owner')
    .then((movies) => res.send(movies))
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};
const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      }
      const userId = req.user._id.toString();
      const movieOwnerId = movie.owner._id.toString();
      const movieIsMine = userId === movieOwnerId;
      if (movieIsMine) {
        Movie.findByIdAndRemove(movieId)
          .then((deletedMovies) => res.send(deletedMovies))
          .catch((err) => {
            errorHandle(err, next);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Вы не можете этого сделать');
      }
    })
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};
module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};