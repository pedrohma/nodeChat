var format = require('../util/dateFormat');

module.exports = function (listener) {

    var io = require('socket.io').listen(listener);

    var users = [];
    var colors = ["#d77ee7", "#7ea0e7", "#7ee7bf", "#7ee795", "#c9ff00", "#ffc100", "#8245e3", "#8245e3", "#900303", "#f6b045"];

    io.on('connection', function (socket) {
        var addedUser = false;
        var userId;

        socket.on('disconnect', function () {
            if (addedUser) {
                removeUser(userId);
            }

            var msg = { style: 'disconnect', message: userId + ' disconnected', date: format.data.formatAMPM(new Date()), from: null };
            socket.broadcast.emit('message', msg);
        });

        socket.on('message', function (msg, user) {
            if (msg != '' && msg != null) {
                userId = user;
                var user = getUser(user);
                var message = { style: 'message', message: msg, date: format.data.formatAMPM(new Date()), from: user };
                io.emit('message', message);
                // db.newMsg(message);
            }
        });

        socket.on('checkUser', function (name) {
            if (addedUser) return;
                if (name == undefined || name == ''){
                    socket.emit('error', {
                        err: 'You must enter a name, it cant be empty'
                    });
                };
                socket.username = name;
                var color = getColor();
                var user = { name: name, color: color };
                userId = name;
                users.push(user);
                var msg = { style: 'connected', message: name + " connected", date: format.data.formatAMPM(new Date()), from: null};
                socket.broadcast.emit('message', msg);
                socket.broadcast.emit('userlist', {
                    users: users
                });
                addedUser = true;
            // db.newUser(msg);
        });

        socket.on('typing', function (user) {
            var msg = { style: 'connected', message: socket.username + " is typing a message...", date: format.data.formatAMPM(new Date()), from: null };
            socket.broadcast.emit('typing', msg);
        });

        // socket.on('stop typing', () => {
        //     socket.broadcast.emit('stop typing', {
        //         username: socket.username
        //     });
        // });

    });

    function getColor() {
        if (colors.length <= 0) {
            throw "No color available.";
        }
        var num = Math.floor((Math.random() * colors.length));
        var color = colors[num];
        var index = colors.indexOf(num);
        colors.splice(index, 1);
        return color;
    }

    function getUser(name) {
        var user = null;
        for (i = 0; i < users.length; i++) {
            if (users[i].name == name) {
                user = users[i];
            }
        }
        return user;
    }

    function removeUser(name) {
        var user = getUser(name);
        colors.push(user.color);
        var index = users.indexOf(name);
        users.splice(index, 1);
    }
}