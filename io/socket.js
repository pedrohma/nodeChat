var format = require('../util/dateFormat');
var userMethods = require('../util/userMethods');

module.exports = function (listener) {

    var io = require('socket.io').listen(listener);

    io.on('connection', function (socket) {
        var addedUser = false;

        socket.on('disconnect', function () {
            if (addedUser) {
                userMethods.RemoveUser(socket.username);
                var msg = { style: 'disconnect', message: socket.username + ' disconnected!', users: userMethods.GetUsers() };
                io.emit('disconnect', msg);
            }
        });

        socket.on('message', function (msg, user) {
            if (msg != '' && msg != null) {
                userId = user;
                var user = userMethods.GetUser(user);
                var message = { style: 'message', message: msg, date: format.data.formatAMPM(new Date()), from: user };
                io.emit('message', message);
            }
        });

        socket.on('checkUser', function (name) {
            if (addedUser) return;
            if (name == undefined || name == '') {
                socket.emit('joinerror', {
                    err: 'You must enter a name, it cant be empty.'
                });
            }
            else{
                if(userMethods.UsernameIsAvailable(name)){
                    socket.username = name;
                    var user = { name: name, color: userMethods.GetColor(), id: socket.id };
                    userMethods.AddUser(user); 
                    var msg = { message: name + " connected!", users: userMethods.GetUsers() };
                    io.emit('joinsuccess', msg);
                    addedUser = true;
                }
                else{
                    socket.emit('joinerror', {
                        err: name + ' is already in use. Try another nickname!'
                    });
                }
            }
        });

        socket.on('userlist', function () {
            io.emit('userlist', userMethods.GetUsers());
        });

        socket.on('typing', function (user) {
            var msg = { message: user + " is typing a message..." };
            socket.broadcast.emit('typing', msg);
        });

    });
}