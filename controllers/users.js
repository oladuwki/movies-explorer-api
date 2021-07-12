const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const { NODE_ENV, JWT_SECRET } = process.env;

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

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(user);
    })
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      errorHandle(err, next);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUser,
  login,
  getUserMe,
};