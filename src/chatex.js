'use strict';

const CHATEX_API_ROOT = 'https://api.staging.iserverbot.ru/v1';
const CHATEX_REFRESH_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmI0Y2Y5Mi0yYmRmLTRhYzEtYTE2NS05MjZiODI4Nzc4ZTkiLCJpYXQiOjE2MzI1NTk5MDUsImlzcyI6ImNoYXRleC1pZCIsInN1YiI6InVzZXIiLCJ1aWQiOjE0MzgsInZlciI6MSwicmVzIjpbMV0sInR5cCI6MSwic2NvcGVzIjpbImNvcmU6cmVhZCIsInByb2ZpbGU6cmVhZCIsInByb2ZpbGU6YWN0aW9uIiwiYXV0aDphY3Rpb24iLCJjaGF0ZXhfcGF5OnJlYWQiLCJjaGF0ZXhfcGF5OmFjdGlvbiIsImV4Y2hhbmdlOnJlYWQiLCJleGNoYW5nZTphY3Rpb24iLCJub3RpZmljYXRpb25zOnJlYWQiLCJub3RpZmljYXRpb25zOmFjdGlvbiIsIndhbGxldDpyZWFkIiwid2FsbGV0OmFjdGlvbiIsImFmZmlsaWF0ZTpyZWFkIiwiYWZmaWxpYXRlOmFjdGlvbiIsImNvbnZlcnNhdGlvbjpyZWFkIiwiY29udmVyc2F0aW9uOmFjdGlvbiIsInBheW91dHM6cmVhZCIsInBheW91dHM6YWN0aW9uIl0sImlzXzJmYV9kaXNhYmxlZCI6ZmFsc2V9.H1jaOdexbYWgFmXXBnTWt7G7jvujo_c404vA6M8rcpneTmVRvlSq-3-_WdTrpoboNSMHRm77_FnrvdPIyeB3xg';

const axios = require('axios');

async function auth() {
  let {access_token: accessToken} = await apiPost(CHATEX_REFRESH_TOKEN, '/auth/access-token');

  return {
    async makeInvoice(chatex_id, coin, amount) {
      let data = await apiPost(accessToken, '/invoices', {
        "amount": amount,
        "coin": coin,
        "fiat": "RUB",
        "payment_system_id": 347,
        "country_code": "RUS",
        "lang_id": "RU",
        "callback_url": "https://chatex.noftgames.io/chatex-callback",
        "data": JSON.stringify({chatex_id})
      });
      return data;
    },
    async payout(chatex_id, coin, amount) {
      await apiPost(accessToken, '/wallet/transfers', {coin, amount, recipient: chatex_id, second_factor: {mode: 'PIN', code: '1111'}})
    }

  }
}

module.exports = {auth};

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