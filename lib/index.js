const express = require('express');
const dotenv = require('dotenv');
const authenticator = require('./authenticator');
const deployer = require('./deployer');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(authenticator(process.env.PASSWORD));

app.route('/deploy')
  .post(deployer(process.env.ENV_LIST, process.env.API_KEY))
  .all((req, res) => {
    res.status(405).set('Allow', 'POST').send('Please use a POST request.');
  });

app.all('*', (req, res) => {
  res.status(404).send('Not found');
});

app.listen(port, () => {
  console.log(`> Listening on port ${port}`);
});
