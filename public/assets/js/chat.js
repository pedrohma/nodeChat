var socket = io();

var user = "";

$(document).ready(function () {
    $("#enterModal").modal({ backdrop: 'static', keyboard: false });
});

function sendMessage() {
    var msg = $("#msg").val();
    socket.emit('message', msg, user);
    $("#msg").val('');
    return false;
}


socket.on('message', function (msg) {
    var style = msg.style;
    var message = msg.message;
    var time = msg.date;
    var from = msg.from;
    var appendStr = "";
    switch (style) {
        case 'connected':
            appendStr += "<div class='alert alert-success' role='alert'>" + message + "</div>"
            break;
        case 'disconnect':
            appendStr += "<div class='alert alert-danger' role='alert'>" + message + "</div>"
            break;
        case "message":
            if (from != null && from != user) {
                appendStr += "<li class='right clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right receiver'><b>" + from + "</b></strong><small class='text-muted'><span class='glyphicon glyphicon-time'></span><i>" + time + "</i></small></p></div><p>" + message + "</p></div></li>";
            }
            else {
                appendStr += "<li class='left clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right sender'><b>" + from + "</b></strong><small class='text-muted'><span class='glyphicon glyphicon-time'></span><i>" + time + "</i></small></p></div><p>" + message + "</p></div></li>";
            }
            break;
        default:

            break;
    }

    $('.chat').append($(appendStr));
});

function typeMsg() {
    socket.emit('typing', user);
}

socket.on('typing', function (msg) {
    var message = msg.message;
    $("#typing").show();
    $("#typing").text(message).delay(2000).fadeOut();
});

function enterChat() {
    var username = $("#username").val();
    user = username;
    socket.emit('checkUser', user);
    $("#enterModal").modal('hide');
}

function sendEnterMessage(e) {
    if (e.keyCode == 13) {
        document.getElementById("msgBtn").click();
        return false;
    }
}

