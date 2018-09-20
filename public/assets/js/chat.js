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
    var appendStr = "";
    var audio;
    switch (style) {
        case 'connected':
            appendStr += "<div class='alert alert-success' role='alert'>" + message + "</div>"
            audio =  new Audio('/assets/sound/new.mp3');
            break;
        case 'disconnect':
            appendStr += "<div class='alert alert-danger' role='alert'>" + message + "</div>"
            audio =  new Audio('/assets/sound/out.mp3');
            break;
        case "message":
            var from = msg.from.name;
            var color = msg.from.color;
            if (from != null && from != user) {
                appendStr += "<li class='right clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + " '><b>" + from + "</b></strong><small class='text-muted'><span class='glyphicon glyphicon-time'></span><i>" + time + "</i></small></p></div><p>" + message + "</p></div></li>";
                audio =  new Audio('/assets/sound/stairs.mp3');
            }
            else {
                appendStr += "<li class='left clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + "><b>" + from + "</b></strong><small class='text-muted'><span class='glyphicon glyphicon-time'></span><i>" + time + "</i></small></p></div><p>" + message + "</p></div></li>";
                audio =  new Audio('/assets/sound/stairs.mp3');
            }
            break;
        default:
            break;
    }
    
    audio.play();
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

