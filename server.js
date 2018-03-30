var net = require("net");

var count = 0;

var server = net.createServer(function (conn) {

    conn.setEncoding("utf8");

    conn.write(
        "\n > welcome to node-chat" +
        "\n > " + count + " other people are connected at this time." +
        "\n > please write your name and press enter: "
    );
    count++;

    conn.on("data", function (data) {
        console.log(data);
    });
    
    conn.on("close", function () {
        count--;
    });
});

server.listen(3000, function () {
    console.log("server listening on *:3000");
});