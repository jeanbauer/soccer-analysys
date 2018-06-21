const express = require('express');
const fs = require('fs');

const app = express();
const log = bubbles => console.log("=====>", bubbles);
const { getPlayerQuery } = require('./queries')
const { mysql } = require('./mysql')

fs.readFile('./config.json', 'utf-8', (error, data) => {
  if (error) {
    console.log(`Erro: ${error}`);
    throw error;
  }

  const { serverName, serverIP, portListen, memcachedServer, memcachedPort, yearData } = JSON.parse(data)
  init(portListen);
});

const init = port => {
  app.listen(port, () => console.log(`⚡️ Aplicação rodando na porta: ${port}! ⚡️`))
  const connection = mysql();

  // TODO: Move this logic to a separate directory
  app.get('/getData/:year', (req, res) => {
    const year = req.params.year;
    const playerName = req.query.playerName;

    connection.query(getPlayerQuery(playerName, year), (error, results) => {
      if (error) throw error;
      res.send({ results })
      connection.end();
    });
  })
}