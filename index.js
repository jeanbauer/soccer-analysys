const express = require('express');
const app = express();
const fs = require('fs');
const log = bubbles => console.log("=====>", bubbles);
const { getPlayerQuery, getPlayerClubQuery } = require('./queries')

fs.readFile('./config.json', 'utf-8', (error, data) => {
  if (error) {
    console.log(`Erro: ${error}`);
    throw error;
  }

  const {
    serverName,
    serverIP,
    portListen,
    memcachedServer,
    memcachedPort,
    yearData
  } = JSON.parse(data)

  init(portListen);
});

const init = port => {
  app.listen(port, () => console.log(`⚡️ Aplicação rodando na porta: ${port}! ⚡️`))

  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'soccer'
  });

  connection.connect();

  // TODO: Move this logic to a separate directory
  app.get('/getData/:year', (req, res) => {
    const year = req.params.year;
    const playerName = req.query.playerName;

    connection.query(getPlayerQuery(playerName, year), (error, results) => {
      if (error) throw error;
      log('MYSQL: ', results[0]);

      res.send({
        results
      })

      connection.end();
    });
  })
  //Get da pesquisa de Ano/ Clube
  app.get('/getData/:year', (req, res) => {
    const year = req.params.year;
    const clubName = req.query.clubName;

    connection.query(getPlayerClubQuery(year, clubName), (error, results) => {
      if (error) throw error;
      log('MYSQL: ', results[0]);

      res.send({
        results
      })

      connection.end();
    });
  })
}
