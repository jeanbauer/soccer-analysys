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
  SELECT player_api_id
  FROM \`player\`
  WHERE player_name = "${playerName}"
`;

const getTeamId = teamName => `
  SELECT team_api_id
  FROM \`team\`
  WHERE team_long_name = "${teamName}"
`;

const getClubQuery = (clubId, year) => `
  SELECT *
  FROM \`match\`
  WHERE year(\`match\`.\`date\`) = ${year}
  AND
  (home_team_api_id = ${clubId} || away_team_api_id = ${clubId})
`;

const getPlayerClubQuery = (playerName, year, clubName) => `
  SELECT (\`match\`.\`home_team_goal\` - \`match\`.\`away_team_goal\`) as resultado +
          FROM \`player\` +
          INNER JOIN \`match\` +
              on \`match\`.\`home_player_1\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_2\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_3\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_4\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_5\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_6\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_7\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_8\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_9\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_10\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`home_player_11\` = \`player\`.\`player_api_id\` +
          INNER JOIN \`team\` +
              on \`match\`.\`home_team_api_id\` = \`team\`.\`team_api_id\` +
          where \`player\`.\`player_name\` = ' + playerName + ' +
              and \`team\`.\`team_long_name\`) = ' + clubName + ' +
              and year(\`match\`.\`date\`) = ' + year + ' +
              and (\`match\`.\`home_team_goal\` - \`match\`.\`away_team_goal\`) <> 0 +
          union all +
          SELECT (\`match\`.\`away_team_goal\` - \`match\`.\`home_team_goal\`) as resultado +
          FROM \`player\` +
          INNER JOIN \`match\` +
              on \`match\`.\`away_player_1\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_2\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_3\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_4\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_5\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_6\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_7\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_8\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_9\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_10\` = \`player\`.\`player_api_id\` +
              or \`match\`.\`away_player_11\` = \`player\`.\`player_api_id\` +
          INNER JOIN \`team\` +
              on \`match\`.\`away_team_api_id\` = \`team\`.\`team_api_id\` +
          where \`player\`.\`player_name\` = ' + playerName + ' +
              and \`team\`.\`team_long_name\` = ' + clubName + ' +
              and year(\`match\`.\`date\`) = ' + year + ' +
                      and (\`match\`.\`away_team_goal\` - \`match\`.\`home_team_goal\`) <> 0;`
;

exports.getPlayerClubQuery = getPlayerClubQuery;
exports.getClubQuery = getClubQuery;
exports.getPlayerQuery = getPlayerQuery;
exports.getPlayerId = getPlayerId;
exports.getTeamId = getTeamId;
