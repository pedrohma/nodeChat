var socket = io();

var user = "";

$(document).ready(function (){
    $("#enterModal").modal({backdrop: 'static', keyboard: false});
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
    var styleClass = "list-group-item";
    switch (style) {
        case 'connected':
            styleClass += " list-group-item-success";
            break;
        case 'disconnect':
            styleClass += " list-group-item-danger";
            break;
        case 'message':
            styleClass += " list-group-item-light";
            break;
        default:
            break;
    }
    var appendStr = "";
    if(from != null && from != user){
        appendStr += "<li class='list-group-item list-group-item-primary'>";
    }
    else{
        appendStr += "<li class='" + styleClass + "'>";
    }
    appendStr += "<p>";
    if(from != null){
        appendStr += "<p><small><b>" + from + "</b></small></p>";
    }
    appendStr += "<span style='float: left;'>" + message + "</span>"; 
    appendStr += "<span style='float: right;'><span class='badge badge-primary badge-pill'>" + time + "</span></span>";
    appendStr += "</p></li>";
    $('#messages').append($(appendStr));
});

function typeMsg(){
    socket.emit('typing', user);
}

socket.on('typing', function(msg){
    var message = msg.message;
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