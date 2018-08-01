var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var db = require("./database.js");
var http = require('http');
var format = require('./util/dateFormat');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var users = [];

var colors = ["#d77ee7", "#7ea0e7", "#7ee7bf", "#7ee795", "#c9ff00", "#ffc100", "#8245e3", "#8245e3", "#900303", "#f6b045"];

var user = "";

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on ' + listener.address().port);
});

var io = require('socket.io').listen(listener);

io.on('connection', function(socket){ 
  
     socket.on('disconnect', function(){
        var msg = {style: 'disconnect', message: 'user disconnected', date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('message', msg);
        console.log('user disconnected');
      });

      socket.on('message', function(msg, user){
        if(msg != '' && msg != null){
          var user = getUser(user);
          console.log('this is the user -> ' + user.name);
          var message = {style: 'message', message: msg, date: format.data.formatAMPM(new Date()), from: user};
          // console.log(format.data.formatAMPM(new Date()));
          io.emit('message', message);
          // console.log('user ' + user + ' sent : ' + msg);
          // db.newMsg(message);
        }
      });

      socket.on('checkUser', function (user){
        var color = getColor();
        var user = {name: user, color: color};
        users.push(user);
        console.log(user);
        var msg = {style: 'connected', message: user.name + " connected", date: format.data.formatAMPM(new Date()), from: null, color: color};
        socket.broadcast.emit('message', msg);
        // db.newUser(msg);
      });

      socket.on('typing', function(user){
        var msg = {style: 'connected', message: user.name + " is typing a message...", date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('typing', msg);
    });

});

function getColor(){
  var num = Math.floor((Math.random() * colors.length) + 1);
  var color = colors[num];
  var index = colors.indexOf(num);
  colors.splice(index, 1);
  return color;
}

function getUser(name){
  var user = null;
  for(i = 0; i < users.length; i++){
    if(users[i].name == name){
      user = users[i];
    }
  }
  return user;
}