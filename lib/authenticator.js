const express = require('express');
const bearerToken = require('express-bearer-token');

const router = express.Router;

/**
 * Create authentication middleware that requires a specific token to continue. The `token`
 * parameter can also be left out, which allows any request to go through.
 * @param {String} [token] - Required bearer token.
 * @returns {Object} Express middleware.
 */
module.exports = (token = null) => {
  const middleware = router();

  middleware.use(bearerToken());

  if (token) {
    middleware.use((req, res, next) => {
      if (req.token && req.token === token) {
        next();
      } else {
        res.status(401).send('Please include a bearer token in your request.');
      }
    });
  } else {
    middleware.use((req, res, next) => {
      if (req.token) {
        res.status(400).send('A bearer token was sent, but none is required.');
      } else {
        next();
      }
    });
  }

  return middleware;
};
