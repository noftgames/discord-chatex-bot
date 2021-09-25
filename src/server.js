'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const jayson = require('jayson');

const api = require('./api');
const jaysonServer = new jayson.Server(new Proxy({}, {
  get(target, name) {
    return async function (args, callback) {
      let fn = api[name];
      try {
        let result = await fn(...args);
        callback(null, result);
      } catch (err) {
        callback(err);
      }
    }
  }
}));
jaysonServer.http().listen(process.env.RPC_PORT || 8081, () => console.log(`RPC started at port ${process.env.RPC_PORT || 8081}`));

app.use(bodyParser({json: true}));

app.post(`/chatex-callback`, async (req, res) => {
  console.log(`new request: `, req.body);
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => console.log(`Server started at port ${process.env.PORT || 8080}`));