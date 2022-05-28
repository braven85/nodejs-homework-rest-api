const Joi = require("joi");

const postSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  phone: Joi.number(),
});

// const putSchema = Joi.object({
//   name: Joi.string(),
//   email: Joi.string().email(),
//   phone: Joi.number(),
// });

const userSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
});

module.exports = { postSchema, userSchema };
