const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const createMovieValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().trim().required(),
    director: Joi.string().trim().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().trim().required(),
    image: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    trailer: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    thumbnail: Joi.string().trim().regex(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().trim().required(),
    nameEN: Joi.string().trim().required(),
  }),
});

const movieValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex(),
  }),
});

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/', getMovies);
router.post('/', createMovieValidation, createMovie);
router.delete('/:movieId', movieValidation, deleteMovie);
module.exports = router;
