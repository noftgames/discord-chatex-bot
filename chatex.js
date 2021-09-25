'use strict';

const TIMEOUT = 2000;

// const CHATEX_API_ROOT = 'https://api.chatex.com/v1';
// const CHATEX_REFRESH_TOKEN = '';

const CHATEX_API_ROOT = 'http://api.staging.iserverbot.ru/v1';
const CHATEX_REFRESH_TOKEN = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNmI0Y2Y5Mi0yYmRmLTRhYzEtYTE2NS05MjZiODI4Nzc4ZTkiLCJpYXQiOjE2MzI1NTk5MDUsImlzcyI6ImNoYXRleC1pZCIsInN1YiI6InVzZXIiLCJ1aWQiOjE0MzgsInZlciI6MSwicmVzIjpbMV0sInR5cCI6MSwic2NvcGVzIjpbImNvcmU6cmVhZCIsInByb2ZpbGU6cmVhZCIsInByb2ZpbGU6YWN0aW9uIiwiYXV0aDphY3Rpb24iLCJjaGF0ZXhfcGF5OnJlYWQiLCJjaGF0ZXhfcGF5OmFjdGlvbiIsImV4Y2hhbmdlOnJlYWQiLCJleGNoYW5nZTphY3Rpb24iLCJub3RpZmljYXRpb25zOnJlYWQiLCJub3RpZmljYXRpb25zOmFjdGlvbiIsIndhbGxldDpyZWFkIiwid2FsbGV0OmFjdGlvbiIsImFmZmlsaWF0ZTpyZWFkIiwiYWZmaWxpYXRlOmFjdGlvbiIsImNvbnZlcnNhdGlvbjpyZWFkIiwiY29udmVyc2F0aW9uOmFjdGlvbiIsInBheW91dHM6cmVhZCIsInBheW91dHM6YWN0aW9uIl0sImlzXzJmYV9kaXNhYmxlZCI6ZmFsc2V9.H1jaOdexbYWgFmXXBnTWt7G7jvujo_c404vA6M8rcpneTmVRvlSq-3-_WdTrpoboNSMHRm77_FnrvdPIyeB3xg';

const AUTH_REQUESTS = {};

const axios = require('axios');

let obj = {
  async auth(user) {
    let data = await apiPost('/auth', {"mode": "CHATEX_BOT", "identification": user});
    console.log(data);
    AUTH_REQUESTS[user] = data;
  },
  async isAuthorized(user) {
    if (!AUTH_REQUESTS[user]) return false;
    if (AUTH_REQUESTS[user].status === 'APPROVED') return true;
    let request_id = AUTH_REQUESTS[user].request_id;
    let start = Date.now();
    try {
      let data = await apiPost('/auth/wait-confirmation', {"request_id": request_id});
      if (data) AUTH_REQUESTS[user] = data;
      return data && data.status === 'APPROVED';
    } catch (err) {
      let delta = Date.now() - start;
      if (delta >= TIMEOUT) {
        return false;
      }
      throw err;
    }
  },
  async waitAuthorization(user) {
    while (true) {
      let isAuthorized = await this.isAuthorized(user);
      if (isAuthorized) return;
      await timeout(TIMEOUT);
    }
  },
  async getBalance(user) {
    let isAuthorized = await this.isAuthorized(user);
    if (!isAuthorized) {
      throw new Error('not authorized');
    }
    let data = await apiGet('/me/balance');
    return data; 
  }
};

run().then(() => console.log('done')).catch(err => console.error(err));

async function run() {
  // let data = await apiPost('/auth/access-token');
  await obj.auth('keshas');
  await obj.waitAuthorization('keshas');
  console.log('1', await obj.isAuthorized('keshas'));
  console.log(await obj.getBalance('keshas'));
  // await timeout(15000);
  // console.log('2', await obj.isAuthorized('keshas'));
  
}

// module.exports = async refreshToken => {
//   let data = await axios({
//     method: 'post',
//     url: API_ROOT + '/auth/access-token',

//   })
// };

// const interface = {
//   async isAuthorized() {},
//   async setFee() {},
//   async getFee() {},
//   async toPool(user, amount, currency) { return 'eth';},
//   async getPoolBalance() {},
//   async fromPool(user, amount) {}
// };

async function apiPost(method, data) {
  try {
    let response = await axios({
      method: 'post',
      url: CHATEX_API_ROOT + method,
      data,
      headers: {
        Authorization: `Bearer ${CHATEX_REFRESH_TOKEN}`,
        contentType: 'application/json'
      },
      responseType: 'application/json',
      timeout: TIMEOUT
    });

    return response.data;
  } catch (err) {
    // console.error(`Error while fetching ${method}: ${err.code}`);
    throw err;
  }
}

async function apiGet(method, data) {
  try {
    let response = await axios({
      method: 'get',
      url: CHATEX_API_ROOT + method,
      data,
      headers: {
        Authorization: `Bearer ${AUTH_REQUESTS['keshas'].refresh_token || CHATEX_REFRESH_TOKEN}`,
        contentType: 'application/json'
      },
      responseType: 'application/json',
      timeout: TIMEOUT
    });

    return response.data;
  } catch (err) {
    // console.error(`Error while fetching ${method}: ${err.code}`);
    throw err;
  }
}

async function timeout(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}