var express = require('express');
var app = express();

// SD_Data_<periodo>
app.get('/SD_Data_:periodo', function (req, res) {

  res.send(JSON.stringify({
    wins: 320,
    losses: 456,
    periodo: req.params.periodo
  }));
});

// SD_Data_<periodo>_<clube>
// SD_Data_<periodo>__<jogador>
// SD_Data_<periodo> _ <clube> _ <jogador>

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});