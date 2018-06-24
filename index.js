const express = require('express');
const fs = require('fs');

const app = express();
const log = bubbles => console.log("=====>", bubbles);
const { mysql } = require('./mysql')
const { getPlayerQuery, getPlayerId, getPlayerClubQuery } = require('./queries')
const { notFound, serverUnavailable } = require('./error')

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
  app.get('/getData/:year', async (req, res) => {
    const year = req.params.year;
    const playerName = req.query.playerName;
    const clubName = req.query.clubName;

    if (clubName) {
      connection.query(getPlayerClubQuery(year, clubName), (error, results) => {
        if (error) throw error;
        res.send({ results })
        connection.end();
      });
    }

    console.time("DB response time")
    connection.query(getPlayerId(playerName), (error, player) => {

      if (!player[0] || error) return res.status(417).send(notFound)

      const playerApiId = player[0].player_api_id;

      connection.query(getPlayerQuery(playerApiId, year), (error, results) => {
        if (error) throw error;
        console.timeEnd("DB response time")

        const attr = Object.keys(results[0])
        let win = 0
        let losses = 0

        console.time("Javascript processing time")
        results.map(r => {
          attr.forEach(a => {
            if (r[a] == playerApiId) {
              const score = r['home_team_goal'] - r['away_team_goal']

              if (a.indexOf('home') >= 0) { score > 0 ? win++ : losses++ }
              if (a.indexOf('away') >= 0) { score < 0 ? win++ : losses++ }

              return
            }
          })
        })
        console.timeEnd("Javascript processing time")

        res.send({ win, losses })
      });
    })
  })
}
