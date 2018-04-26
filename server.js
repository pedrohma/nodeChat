var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var users = [];

var user = "";

io.on('connection', function(socket){ 
      var now = new Date().getHours() + ":" + new Date().getMinutes();

      
     socket.on('disconnect', function(){
        var msg = {style: 'disconnect', message: 'user disconnected', date: now, from: null};
        socket.broadcast.emit('message', msg);
        console.log('user' + ' disconnected');
      });

      socket.on('message', function(msg, user){
        console.log(user);
        if(msg != '' && msg != null){
          var message = {style: 'message', message: msg, date: now, from: user};
          io.emit('message', message);
          console.log('user ' + user + ' sent : ' + msg);
        }
      });

      socket.on('checkUser', function (user){
        users.push(user);
        var msg = {style: 'connected', message: user + " connected", date: now, from: null};
        socket.broadcast.emit('message', msg);
      });

      socket.on('typing', function(user){
        var msg = {style: 'connected', message: user + " is typing a message...", date: now, from: null};
        socket.broadcast.emit('typing', msg);
    });

});

var listener = server.listen(3000, function () {
    console.log('Server listening on ' + listener.address().port);
});