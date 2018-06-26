const express = require('express');
const fs = require('fs');

const app = express();
const log = bubbles => console.log("=====>", bubbles);

const { mysql } = require('./mysql')
const Memcached = require('memcached');

const { getPlayerQuery, getTeamId, getPlayerId, getClubQuery, getPlayerClubQuery } = require('./queries')
const { notFound, serverUnavailable } = require('./error')
let config = {}
let memcached
let serverName, serverIP, portListen, memcachedServer, memcachedPort, yearData

const getMatchesResults = (results, keys, playerApiId) => {
  let win = 0, losses = 0
  results.map(r => {
    keys.forEach(a => {
      if (r[a] == playerApiId) {
        const score = r['home_team_goal'] - r['away_team_goal']

        if (a.indexOf('home') >= 0) { score > 0 ? win++ : losses++ }
        if (a.indexOf('away') >= 0) { score < 0 ? win++ : losses++ }

        return
      }
    })
  })

  return { win, losses }
}

fs.readFile('./config.json', 'utf-8', (error, data) => {
  if (error) {
    console.log(`Erro: ${error}`);
    throw error;
  }

  // node index.js jean 127.0.0.1 1111 10.1.1.1 11211 1999,2000
  const argv = process.argv.slice(2);
  serverName = argv[0]
  serverIP = argv[1]
  portListen = argv[2]
  memcachedServer = argv[3]
  memcachedPort = argv[4]
  yearData = argv[5] && argv[5].split(",")

  if (serverName && serverIP && portListen && memcachedServer && memcachedPort && yearData) {
    log('Parametros de inicialização foram passados via terminal com sucesso!')
  } else {
    const configFile = JSON.parse(data)
    serverName = configFile.serverName
    serverIP = configFile.serverIP
    portListen = configFile.portListen
    memcachedServer = configFile.memcachedServer
    memcachedPort = configFile.memcachedPort
    yearData = configFile.yearData
  }

  console.log(serverName, serverIP, portListen, memcachedServer, memcachedPort, yearData)
  init(portListen);
  memcached = new Memcached(`${memcachedServer}:${memcachedPort}`);
});

const init = port => {
  app.listen(port, () => console.log(`⚡️ Aplicação rodando na porta: ${port}! ⚡️`))
  const connection = mysql();

  app.get('/getAvailabeYears', (req, res) => {
    return res.send({ years: config.yearData });
  })

  // TODO: Move this logic to a separate directory
  app.get('/getData/:year', async (req, res) => {
    const year = req.params.year;
    const playerName = req.query.playerName;
    const clubName = req.query.clubName;

    if (clubName && playerName) {
      return connection.query(getTeamId(clubName), (error, clubId) => {
        if (!clubId[0] || error) return res.status(417).send(notFound)
        const clubApiId = clubId[0].team_api_id;

        connection.query(getPlayerId(playerName), (error, playerId) => {
          if (!playerId[0] || error) return res.status(417).send(notFound)
          const playerApiId = playerId[0].player_api_id;

          connection.query(getPlayerClubQuery(clubApiId, playerApiId, year), (error, matches) => {
            const keys = Object.keys(matches[0])
            res.send(getMatchesResults(matches, keys, playerApiId))
            return
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

      connection.query(getPlayerQuery(playerApiId, year), (error, matches) => {
        if (error) throw error;
        console.timeEnd("DB response time")
        const keys = Object.keys(matches[0])
        console.time("Javascript processing time")
        res.send(getMatchesResults(matches, keys, playerApiId))
        console.timeEnd("Javascript processing time")
        return
      });
    })
  })

  // 404, testar
  app.get('/*', (req, res) => {
    return res.status(417).send(serverUnavailable)
  })
}
