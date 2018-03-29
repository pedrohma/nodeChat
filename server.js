var net = require("net");

var server = net.createServer(function (conn) {
    console.log("new Connection!");
});

server.listen(3000, function () {
    console.log("server listening on *:3000");
});