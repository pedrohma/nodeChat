var express = require('express');
var app = express();
var bodyParser = require('body-parser');
bodyParser.urlencoded({limit: '50mb', extended: true });
app.use(express.static('./public'));

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on ' + listener.address().port);
});

require('./io/socket.js')(listener);