const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const redisClient = require('./redis-client');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/store', async (req, res) => {
  var data = req.body;

  await redisClient.setAsync('stats', JSON.stringify(data));
  return res.send('Success');
});

app.get('/stats', async (req, res) => {
  const { key } = req.params;
  const rawData = await redisClient.getAsync('stats');
  return res.json(JSON.parse(rawData));
});

app.get('/', (req, res) => {
  return res.send('Mutants redis cache server');
});

app.get('/test', (req, res) => {
  return res.send('test');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  // console.log(`Server listening on port ${PORT}`);
});


/**
 * cache creator
 * curl --header "Content-Type: application/json" \
  --request POST \
  --data $(curl http://localhost/stats) \
  http://localhost:3000/store
 */