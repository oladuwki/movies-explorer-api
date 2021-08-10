const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const {
  updateUser,
  getUserMe,
} = require('../controllers/users');

router.get('/me', getUserMe);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
