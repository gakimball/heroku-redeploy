const express = require('express');
const dotenv = require('dotenv');
const handler = require('./handler');

dotenv.config();

const app = express();

app.post('/deploy', handler(process.env.ENV_LIST, process.env.API_KEY));

app.listen(3000, () => {
  console.log('> Listening on port 3000');
});
