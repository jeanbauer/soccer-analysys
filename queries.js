const select = (playerId) => {
  let statement = ''
  for(i = 1; i <= 11; i++) {
    statement += `home_player_${i} = ${playerId} OR away_player_${i} = ${playerId}`
    if (i != 11) statement += ' OR '
  }
  return statement
}

const getPlayerQuery = (playerId, year) => `
  SELECT *
  FROM \`match\`
  WHERE year(\`match\`.\`date\`) = ${year}
  AND (${select(playerId)})
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

const getPlayerClubQuery = (clubId, playerId, year) => `
  SELECT *
  FROM \`match\`
  WHERE year(\`match\`.\`date\`) = ${year}
  AND (home_team_api_id = ${clubId} || away_team_api_id = ${clubId})
  AND (${select(playerId)})
`;

exports.getPlayerClubQuery = getPlayerClubQuery;
exports.getClubQuery = getClubQuery;
exports.getPlayerQuery = getPlayerQuery;
exports.getPlayerId = getPlayerId;
exports.getTeamId = getTeamId;
