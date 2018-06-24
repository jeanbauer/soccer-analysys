const select = (playerName) => {
  let statement = ''
  for(i = 1; i <= 11; i++) {
    statement += `home_player_${i} = ${playerName} OR away_player_${i} = ${playerName}`
    if (i != 11) statement += ' OR '
  }
  return statement
}

const getPlayerQuery = (playerName, year) => `
  SELECT *
  FROM \`match\`
  WHERE year(\`match\`.\`date\`) = ${year}
  AND (${select(playerName)})
`;

const getPlayerId = playerName => `
  SELECT *
  FROM \`player\`
  WHERE player_name = "${playerName}"
`;

const getClubQuery = (year, clubName) => `
  SELECT (\`Match\`.\`home_team_goal\` - \`Match\`.\`away_team_goal\`) AS resultado
  FROM \`Team\`
  INNER JOIN \`Match\`
      on \`Match\`.\`home_team_api_id\` = \`Team\`.\`team_api_id\`
  WHERE \`Team\`.\`team_long_name\` = '${clubName}'
      and year(\`Match\`.\`date\`) = '${year}'
      and (\`Match\`.\`home_team_goal\` - \`Match\`.\`away_team_goal\`) <> 0
  UNION ALL
  SELECT (\`Match\`.\`away_team_goal\` - \`Match\`.\`home_team_goal\`) as resultado
  FROM \`Team\`
  INNER JOIN \`Match\`
      on \`Match\`.\`away_team_api_id\` = \`Team\`.\`team_api_id\`
  WHERE \`Team\`.\`team_long_name\` = '${clubName}'
      and year(\`Match\`.\`date\`) = '${year}'
      and (\`Match\`.\`away_team_goal\` - \`Match\`.\`home_team_goal\`) <> 0;
`;

const getPlayerClubQuery = (playerName, year, clubName) => `
  SELECT (\`Match\`.\`home_team_goal\` - \`Match\`.\`away_team_goal\`) as resultado +
          FROM \`Player\` +
          INNER JOIN \`Match\` +
              on \`Match\`.\`home_player_1\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_2\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_3\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_4\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_5\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_6\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_7\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_8\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_9\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_10\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`home_player_11\` = \`Player\`.\`player_api_id\` +
          INNER JOIN \`Team\` +
              on \`Match\`.\`home_team_api_id\` = \`Team\`.\`team_api_id\` +
          where \`Player\`.\`player_name\` = ' + playerName + ' +
              and \`Team\`.\`team_long_name\`) = ' + clubName + ' +
              and year(\`Match\`.\`date\`) = ' + year + ' +
              and (\`Match\`.\`home_team_goal\` - \`Match\`.\`away_team_goal\`) <> 0 +
          union all +
          SELECT (\`Match\`.\`away_team_goal\` - \`Match\`.\`home_team_goal\`) as resultado +
          FROM \`Player\` +
          INNER JOIN \`Match\` +
              on \`Match\`.\`away_player_1\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_2\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_3\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_4\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_5\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_6\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_7\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_8\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_9\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_10\` = \`Player\`.\`player_api_id\` +
              or \`Match\`.\`away_player_11\` = \`Player\`.\`player_api_id\` +
          INNER JOIN \`Team\` +
              on \`Match\`.\`away_team_api_id\` = \`Team\`.\`team_api_id\` +
          where \`Player\`.\`player_name\` = ' + playerName + ' +
              and \`Team\`.\`team_long_name\` = ' + clubName + ' +
              and year(\`Match\`.\`date\`) = ' + year + ' +
                      and (\`Match\`.\`away_team_goal\` - \`Match\`.\`home_team_goal\`) <> 0;`
;

exports.getPlayerClubQuery = getPlayerClubQuery;
exports.getClubQuery = getClubQuery;
exports.getPlayerQuery = getPlayerQuery;
exports.getPlayerId = getPlayerId;
