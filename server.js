var net = require("net");

var count = 0;
var users = [];

var server = net.createServer(function (conn) {

    var nickname = '';

    conn.setEncoding("utf8");

    conn.write(
        "\n > welcome to \033[92mnode-chat\033[39m!" +
        "\n > " + count + " other people are connected at this time." +
        "\n > please write your name and press enter: "
    );
    count++;

    function broadcast (msg, exceptMyself) {
        for (var i in users) {
          if (!exceptMyself || i != nickname) {
            users[i].write(msg);
          }
      } }

    conn.on("data", function (data) {
        

        data = data.replace("\r\n", "");

        if (!nickname) {
            if (users[data]) {
                conn.write("\033[93m> nickname already in use. try again:\033[39m ");
                return;
            } else {
                nickname = data;
                users[nickname] = conn;
                broadcast("\033[90m > " + nickname + " joined the room\033[39m\n");
            }
        }
        else {
            // otherwise you consider it a chat message
            broadcast("\033[96m > " + nickname + ":\033[39m " + data + "\n", true);
        }
    });

    conn.on("close", function () {
        count--;
        delete users[nickname];
        broadcast("\033[90m > " + nickname + " left the room\033[39m\n");
    });
});

server.listen(3000, function () {
    console.log("server listening on *:3000");
});