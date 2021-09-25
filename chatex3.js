'use strict';

const TIMEOUT = 2000;

// const CHATEX_API_ROOT = 'https://api.chatex.com/v1';
// const CHATEX_REFRESH_TOKEN = '';

const CHATEX_API_ROOT = 'https://api.staging.iserverbot.ru/v1';
const CHATEX_REFRESH_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmI0Y2Y5Mi0yYmRmLTRhYzEtYTE2NS05MjZiODI4Nzc4ZTkiLCJpYXQiOjE2MzI1NTk5MDUsImlzcyI6ImNoYXRleC1pZCIsInN1YiI6InVzZXIiLCJ1aWQiOjE0MzgsInZlciI6MSwicmVzIjpbMV0sInR5cCI6MSwic2NvcGVzIjpbImNvcmU6cmVhZCIsInByb2ZpbGU6cmVhZCIsInByb2ZpbGU6YWN0aW9uIiwiYXV0aDphY3Rpb24iLCJjaGF0ZXhfcGF5OnJlYWQiLCJjaGF0ZXhfcGF5OmFjdGlvbiIsImV4Y2hhbmdlOnJlYWQiLCJleGNoYW5nZTphY3Rpb24iLCJub3RpZmljYXRpb25zOnJlYWQiLCJub3RpZmljYXRpb25zOmFjdGlvbiIsIndhbGxldDpyZWFkIiwid2FsbGV0OmFjdGlvbiIsImFmZmlsaWF0ZTpyZWFkIiwiYWZmaWxpYXRlOmFjdGlvbiIsImNvbnZlcnNhdGlvbjpyZWFkIiwiY29udmVyc2F0aW9uOmFjdGlvbiIsInBheW91dHM6cmVhZCIsInBheW91dHM6YWN0aW9uIl0sImlzXzJmYV9kaXNhYmxlZCI6ZmFsc2V9.H1jaOdexbYWgFmXXBnTWt7G7jvujo_c404vA6M8rcpneTmVRvlSq-3-_WdTrpoboNSMHRm77_FnrvdPIyeB3xg';

const axios = require('axios');

async function auth() {
  let {access_token: accessToken} = await apiPost(CHATEX_REFRESH_TOKEN, '/auth/access-token');

  return {
    async createInvoice(coin='BTC', amount=0.002, fiat='RUB') {
      let data = await apiPost(accessToken, '/invoices', {
        "amount": amount,
        "coin": coin,
        "fiat": fiat,
        "payment_system_id": 347,
        "country_code": "RUS",
        "lang_id": "RU",
        "callback_url": "https://google.com"
      });
      return data;
    },
  }
}


run().then(() => console.log('done')).catch(err => console.error(err));

async function run() {
  let chatex = await auth();
  console.log(await chatex.createInvoice());
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