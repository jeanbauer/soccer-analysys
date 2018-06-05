var express = require('express');
var app = express();

app.get('/SD_Data_:rest', function (req, res) {
  const rest = req.params.rest;
  const queryParams = rest.split('_');

  if (rest.includes('__')) {
    // /SD_Data_:periodo__:jogador
  }

  // 'SD_Data_:periodo_:clube_:jogador'
  if (queryParams.length === 3) {
    return res.send(JSON.stringify({
      periodo: queryParams[0],
      clube: queryParams[1],
      jogador: queryParams[2],
    }))
  }

  // /SD_Data_<periodo>_<clube>
  if (queryParams.length === 2) {
    return res.send(JSON.stringify({
      periodo: queryParams[0],
      clube: queryParams[1],
    }))
  }
  // /SD_Data_<periodo>_<clube>_<jogador>
  // /SD_Data_<periodo>_<clube>
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});