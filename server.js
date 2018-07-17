var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var db = require("./database.js");
var http = require('http');
var format = require('./util/dateFormat');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

var users = [];

var user = "";

io.on('connection', function(socket){ 
  
     socket.on('disconnect', function(){
        var msg = {style: 'disconnect', message: 'user disconnected', date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('message', msg);
        console.log('user disconnected');
      });

      socket.on('message', function(msg, user){
        if(msg != '' && msg != null){
          var message = {style: 'message', message: msg, date: format.data.formatAMPM(new Date()), from: user};
          console.log(format.data.formatAMPM(new Date()));
          io.emit('message', message);
          console.log('user ' + user + ' sent : ' + msg);
          db.newMsg(message);
        }
      });

      socket.on('checkUser', function (user){
        users.push(user);
        var msg = {style: 'connected', message: user + " connected", date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('message', msg);
        db.newUser(msg);
      });

      socket.on('typing', function(user){
        var msg = {style: 'connected', message: user + " is typing a message...", date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('typing', msg);
    });

});

var listener = server.listen(process.env.PORT || 3000, function () {
    console.log('Server listening on ' + listener.address().port);
});

