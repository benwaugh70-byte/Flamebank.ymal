// Utility helpers: http retry, logging
const axios = require('axios');
const retry = require('retry');

async function httpPostWithRetry(url, data, options = {}, attempts = 3) {
  return new Promise((resolve, reject) => {
    const operation = retry.operation({ retries: attempts - 1, factor: 2, minTimeout: 500, maxTimeout: 5000 });
    operation.attempt(async (current) => {
      try {
        const res = await axios.post(url, data, options);
        return resolve(res.data);
      } catch (err) {
        if (operation.retry(err)) return;
        return reject(operation.mainError());
      }
    });
  });
}

function log(level, message, meta = {}) {
  const ts = new Date().toISOString();
  console.log(JSON.stringify({ ts, level, message, ...meta }));
}

module.exports = {
  httpPostWithRetry,
  log
};