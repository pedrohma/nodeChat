var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(socket){ 
      var msg = {style: 'connected', message: 'user connected'};
      io.emit('message', msg);
      
     socket.on('disconnect', function(){
        var msg = {style: 'disconnect', message: 'user disconnect'};
        io.emit('message', msg);
        console.log('user disconnected');
      });

      socket.on('message', function(msg){
        if(msg != '' && msg != null){
          var now = new Date().getHours() + ":" + new Date().getMinutes();
          var message = {style: 'message', message: msg, date: now};
          io.emit('message', message);
          console.log('message: ' + msg);
        }
      });
});

var listener = server.listen(3000, function () {
    console.log('Server listening on ' + listener.address().port);
});