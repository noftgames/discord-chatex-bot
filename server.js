'use strict';

const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser({json: true}));

app.post(`/chatex-callback`, async (req, res) => {
  console.log(`new request: `, req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => console.log(`Server started at port ${process.env.PORT || 8080}`));