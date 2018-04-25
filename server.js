var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){ 
    console.log('connected'); 
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
      socket.on('message', function(msg){
        console.log('message: ' + msg);
      });
});

var listener = server.listen(3000, function () {
    console.log('Server listening on ' + listener.address().port);
});