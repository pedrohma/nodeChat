var socket = io();

function sendMessage() {
    var msg = $("#msg").val();
    socket.emit('message', msg);
    $("#msg").val('');
    return false;
}

socket.on('message', function (msg) {
    var style = msg.style;
    var message = msg.message;
    var time = msg.date;
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
    appendStr += "<li class='" + styleClass + "'>";
    appendStr += "<p>";
    appendStr += "<span style='float: left;'>" + message + "</span>"; 
    appendStr += "<span style='float: right;'>" + time + "</span>";
    appendStr += "</p></li>";
    $('#messages').append($(appendStr));
});

function enterChat() {
    alert('under development');
}