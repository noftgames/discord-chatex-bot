'use strict';

const TIMEOUT = 2000;

// const CHATEX_API_ROOT = 'https://api.chatex.com/v1';
// const CHATEX_REFRESH_TOKEN = '';

const CHATEX_API_ROOT = 'https://api.staging.iserverbot.ru/v1';
const CHATEX_REFRESH_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmI0Y2Y5Mi0yYmRmLTRhYzEtYTE2NS05MjZiODI4Nzc4ZTkiLCJpYXQiOjE2MzI1NTk5MDUsImlzcyI6ImNoYXRleC1pZCIsInN1YiI6InVzZXIiLCJ1aWQiOjE0MzgsInZlciI6MSwicmVzIjpbMV0sInR5cCI6MSwic2NvcGVzIjpbImNvcmU6cmVhZCIsInByb2ZpbGU6cmVhZCIsInByb2ZpbGU6YWN0aW9uIiwiYXV0aDphY3Rpb24iLCJjaGF0ZXhfcGF5OnJlYWQiLCJjaGF0ZXhfcGF5OmFjdGlvbiIsImV4Y2hhbmdlOnJlYWQiLCJleGNoYW5nZTphY3Rpb24iLCJub3RpZmljYXRpb25zOnJlYWQiLCJub3RpZmljYXRpb25zOmFjdGlvbiIsIndhbGxldDpyZWFkIiwid2FsbGV0OmFjdGlvbiIsImFmZmlsaWF0ZTpyZWFkIiwiYWZmaWxpYXRlOmFjdGlvbiIsImNvbnZlcnNhdGlvbjpyZWFkIiwiY29udmVyc2F0aW9uOmFjdGlvbiIsInBheW91dHM6cmVhZCIsInBheW91dHM6YWN0aW9uIl0sImlzXzJmYV9kaXNhYmxlZCI6ZmFsc2V9.H1jaOdexbYWgFmXXBnTWt7G7jvujo_c404vA6M8rcpneTmVRvlSq-3-_WdTrpoboNSMHRm77_FnrvdPIyeB3xg';

const axios = require('axios');

async function auth(user) {
  // let {request_id} = await apiPost(CHATEX_REFRESH_TOKEN, '/auth', {"mode": "CHATEX_BOT", "identification": user});

  // let refreshToken = null;

  // while (true) {
  //   let data = await apiPost(CHATEX_REFRESH_TOKEN, '/auth/wait-confirmation', {request_id});
  //   if (data.status === 'APPROVED') {
  //     refreshToken = data.refresh_token;
  //     break;
  //   }

  //   if (data.status === 'REJECTED') {
  //     throw new Error('not authorized');
  //   }

  //   await timeout(TIMEOUT);
  // }

  // let {access_token: accessToken} = await apiPost(refreshToken, '/auth/access-token');

  let accessToken;
  if (user === 'keshas') accessToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzI1NzY5MDUsImp0aSI6Ijc2Yjk0OWY0LTg5NTYtNDQyMC1hNGRhLTFkYWUxOTNkMDgzMyIsImlhdCI6MTYzMjU3MzMwNSwiaXNzIjoiY2hhdGV4LWlkIiwic3ViIjoidXNlciIsInVpZCI6MTQzOCwidmVyIjoxLCJyZXMiOlsxXSwidHlwIjoyLCJzY29wZXMiOlsiY29yZTpyZWFkIiwicHJvZmlsZTpyZWFkIiwicHJvZmlsZTphY3Rpb24iLCJhdXRoOmFjdGlvbiIsImNoYXRleF9wYXk6cmVhZCIsImNoYXRleF9wYXk6YWN0aW9uIiwiZXhjaGFuZ2U6cmVhZCIsImV4Y2hhbmdlOmFjdGlvbiIsIm5vdGlmaWNhdGlvbnM6cmVhZCIsIm5vdGlmaWNhdGlvbnM6YWN0aW9uIiwid2FsbGV0OnJlYWQiLCJ3YWxsZXQ6YWN0aW9uIiwiYWZmaWxpYXRlOnJlYWQiLCJhZmZpbGlhdGU6YWN0aW9uIiwiY29udmVyc2F0aW9uOnJlYWQiLCJjb252ZXJzYXRpb246YWN0aW9uIiwicGF5b3V0czpyZWFkIiwicGF5b3V0czphY3Rpb24iXSwiaXNfMmZhX2Rpc2FibGVkIjpmYWxzZX0.vcLr_JmCSiXy_s1M5qgcehS5ZrYXki_FAHdSczPlSvFCPAM3V2vuDSeIE9FKHeR3ZlidHd2wbBWEjbbvIMUt3Q';
  if (user === 'VerKse') accessToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MzI1NzY5MzEsImp0aSI6IjE0YTM1ZjQ1LTkwYTEtNGVhZS1iMDhhLWI3ZDQ4YzI4Y2YzNSIsImlhdCI6MTYzMjU3MzMzMSwiaXNzIjoiY2hhdGV4LWlkIiwic3ViIjoidXNlciIsInVpZCI6MTQ0NywidmVyIjoxLCJyZXMiOlsxXSwidHlwIjoyLCJzY29wZXMiOlsiY29yZTpyZWFkIiwicHJvZmlsZTpyZWFkIiwicHJvZmlsZTphY3Rpb24iLCJhdXRoOmFjdGlvbiIsImNoYXRleF9wYXk6cmVhZCIsImNoYXRleF9wYXk6YWN0aW9uIiwiZXhjaGFuZ2U6cmVhZCIsImV4Y2hhbmdlOmFjdGlvbiIsIm5vdGlmaWNhdGlvbnM6cmVhZCIsIm5vdGlmaWNhdGlvbnM6YWN0aW9uIiwid2FsbGV0OnJlYWQiLCJ3YWxsZXQ6YWN0aW9uIiwiYWZmaWxpYXRlOnJlYWQiLCJhZmZpbGlhdGU6YWN0aW9uIiwiY29udmVyc2F0aW9uOnJlYWQiLCJjb252ZXJzYXRpb246YWN0aW9uIiwicGF5b3V0czpyZWFkIiwicGF5b3V0czphY3Rpb24iXSwiaXNfMmZhX2Rpc2FibGVkIjpmYWxzZX0.IFkAdTp0HYjmFj5eO-fpPAQk91CZ1V_sErCn_g2CBy_3tqe5tb_Jibe7kTs-Y_3yVvuD3ES8hGClUUyvOSr0Ww';

  return {
    async getBalance() {
      return apiGet(accessToken, '/me/balance');
    },
    async transferTo(recipient, coin, amount) {
      let data = await apiPost(accessToken, '/wallet/transfers', {coin, amount, recipient, second_factor: {mode: 'PIN', code: '3574'}});
      return data;
    },
    async createInvoice() {
      let data = await apiPost(accessToken, '/invoices', {
        "amount": 0.002,
        "coin": "btc",
        "fiat": "rub",
        "payment_system_id": 347,
        "country_code": "RUS",
        "lang_id": "RU",
        "callback_url": "https://google.com"
      });
      return data;
    }
  }
}


run().then(() => console.log('done')).catch(err => console.error(err));

async function run() {
  let kesha = await auth('keshas');
  // console.log('kesha', (await kesha.getBalance())[0]);
  let vera = await auth('VerKse');
  // console.log('vera', (await vera.getBalance())[0]);
  // console.log('kesha', (await kesha.getBalance())[0]);
  console.log('========');
  let data = await vera.createInvoice();
  console.log(data);
}

async function apiPost(token, method, data) {
  try {
    let response = await axios({
      method: 'post',
      url: CHATEX_API_ROOT + method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'application/json'
      },
      responseType: 'application/json',
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function apiGet(token, method, data) {
  try {
    let response = await axios({
      method: 'get',
      url: CHATEX_API_ROOT + method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'application/json'
      },
      responseType: 'application/json',
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

async function timeout(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}