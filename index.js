const express = require('express');
const app = express();
const fs = require('fs');
const log = bubbles => console.log("=====>", bubbles);

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

  app.get('/getData/:year', (req, res) => {
    const year = req.params.year;
    const playerName = req.query.playerName;
    const clubName = req.query.clubName;

    res.send({
      year,
      playerName,
      clubName,
    })

    const mysql = require('mysql');
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'me',
      password: 'secret',
      database: 'my_db'
    });

    connection.connect();

    const query = `
      SELECT * FROM players
    `;

    connection.query(query, (error, results) => {
      if (error) throw error;
      console.log('MYSQL: ', results[0].solution);
    });

    connection.end();
  })
}