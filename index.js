const express = require('express');
const fs = require('fs');

const app = express();
const log = bubbles => console.log("=====>", bubbles);

const { mysql } = require('./mysql')
const { getPlayerQuery, getTeamId, getPlayerId, getClubQuery, getPlayerClubQuery } = require('./queries')
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

    if (clubName && playerName) {
      return connection.query(getTeamId(clubName), (error, clubId) => {
        if (!clubId[0] || error) return res.status(417).send(notFound)
        const clubApiId = id[0].team_api_id;

        connection.query(getPlayerId(playerName), (error, playerId) => {
          if (!playerId[0] || error) return res.status(417).send(notFound)
          const playerApiId = id[0].player_api_id;

          connection.query(getPlayerClubQuery(clubApiId, playerApiId, year), (error, matches) => {
            return res.send({ matches })
          })
        })
      })
    }

    if (clubName) {
      console.time("DB response time")
       connection.query(getTeamId(clubName), (error, id) => {
        if (!id[0] || error) return res.status(417).send(notFound)
        const teamApiId = id[0].team_api_id;

        console.time("DB response time 1")

        connection.query(getClubQuery(teamApiId, year), (error, matches) => {
          if (error) throw error;

          let win = 0, losses = 0

          matches.map(match => {
            const score = match['home_team_goal'] - match['away_team_goal']
            if (match.home_team_api_id === teamApiId) score > 0 ? win++ : losses++
            else score < 0 ? win++ : losses++
          })

          return res.send({ win, losses })
        });

        console.timeEnd("DB response time 1")
      })
      console.timeEnd("DB response time")
      return
    }

    console.time("DB response time")
    connection.query(getPlayerId(playerName), (error, id) => {

      if (!id[0] || error) return res.status(417).send(notFound)

      const playerApiId = id[0].player_api_id;

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

        return res.send({ win, losses })
      });
    })
  })
}
