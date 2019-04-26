const express = require('express');
const dotenv = require('dotenv');
const handler = require('./handler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.post('/deploy', handler(process.env.ENV_LIST, process.env.API_KEY));

app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});
