'use strict';

require('../bot/deploy-commands');
require('../bot/index');

const app = require('express')();
const bodyParser = require('body-parser');
const jayson = require('jayson');

const api = require('./api');
const jaysonServer = new jayson.Server(new Proxy(api, {
  get(target, name) {
    return async function (args, callback) {
      let fn = api[name];
      console.log(`Requested ${name} with args: ${args.join(', ')}`);
      try {
        let result = await fn(...args);
        callback(null, result);
      } catch (err) {
        console.error(err);
        callback(err);
      }
    }
  }
}));
api.loadStorage().then(() => console.log(`Storage loaded`));
jaysonServer.http().listen(process.env.RPC_PORT || 8081, () => console.log(`RPC started at port ${process.env.RPC_PORT || 8081}`));

app.use(bodyParser({json: true}));

app.post(`/chatex-callback`, async (req, res) => {
  console.log(`new request: `, req.body);
  try {
    await api.onInvoiceUpdate(req.body);
  } catch (err) {
    console.error(err);
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, () => console.log(`Server started at port ${process.env.PORT || 8080}`));