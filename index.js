const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

let latestTx = "Várakozás...";

app.use(express.static('public'));

app.get('/latest-tx', (req, res) => {
  res.send(latestTx);
});

app.listen(PORT, () => {
  console.log(`Szerver elindult a ${PORT} porton`);
});

const apiKey = 'BC885NEC6GQIC7G9KT8TD1E6KNK48C7BEF';
const address = '0x9184a34795bf6345806a94301c85593cdece9fa8';
const apiUrl = 'https://api.abscan.org/api';

const apiParams = {
  module: 'account',
  action: 'txlist',
  address: address,
  startblock: 0,
  endblock: 99999999,
  page: 1,
  offset: 10,
  sort: 'desc',
  apikey: apiKey
};

async function fetchTransactions() {
  try {
    const response = await fetch(`${apiUrl}?${new URLSearchParams(apiParams)}`);
    const data = await response.json();
    if (data.result && data.result.length > 0) {
      const tx = data.result[0];
      const txDetails = `Tranzakció: ${tx.hash}, Küldő: ${tx.from}, Cím: ${tx.to}, Összeg: ${tx.value}`;
      if (txDetails !== latestTx) {
        latestTx = txDetails;
        console.log(latestTx);
      }
    }
  } catch (err) {
    console.error('Hiba a lekérdezésnél:', err);
  }
}

setInterval(fetchTransactions, 12000);