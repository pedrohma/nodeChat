var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var db = require("./database.js");
const server = require('http').createServer();
var format = require('./util/dateFormat');

var urlencodedParser = bodyParser.urlencoded({limit: '50mb', extended: true })

app.use(express.static('./public'));

var users = [];

var colors = ["#d77ee7", "#7ea0e7", "#7ee7bf", "#7ee795", "#c9ff00", "#ffc100", "#8245e3", "#8245e3", "#900303", "#f6b045"];

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on ' + listener.address().port);
});

var io = require('socket.io').listen(listener);

io.on('connection', function(socket){ 
    var userId;
     
    socket.on('disconnect', function(){
        removeUser(userId);
        var msg = {style: 'disconnect', message: userId + ' disconnected', date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('message', msg);
      });

      socket.on('message', function(msg, user){
        if(msg != '' && msg != null){
          userId = user;
          var user = getUser(user);
          var message = {style: 'message', message: msg, date: format.data.formatAMPM(new Date()), from: user};
          io.emit('message', message);
          // db.newMsg(message);
        }
      });

      socket.on('checkUser', function (user){
        var color = getColor();
        var user = {name: user, color: color};
        userId = user.name;
        users.push(user);
        var msg = {style: 'connected', message: user.name + " connected", date: format.data.formatAMPM(new Date()), from: null};
        socket.broadcast.emit('message', msg);
        // db.newUser(msg);
      });

      socket.on('typing', function(user){
        var msg = {style: 'connected', message: userId + " is typing a message...", date: format.data.formatAMPM(new Date()), from: null};
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

function removeUser(name){
  var user = getUser(name);
  colors.push(user.color);
  var index = users.indexOf(name);
  users.splice(index, 1);
}