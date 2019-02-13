var socket = io();

var user = "";

$(document).ready(function () {
   $("#enterModal").modal({ backdrop: 'static', keyboard: false });
});

function enterChat() {
    var username = $("#username").val();
    user = username;
    socket.emit('checkUser', user);
    socket.emit('userlist');
    $("#enterModal").modal('hide');
}

socket.on('userlist', function (users){
    populateOnlineList(users);
});

socket.on('checkUser', function (msg){
    if(msg != undefined){
        console.log(msg);
        var appendStr = "<div class='alert alert-success' role='alert'>" + msg.message + "</div>";
        var audio = new Audio('/assets/sound/new.mp3');
        audio.play();
        $('.chat').append($(appendStr));
        populateOnlineList(msg.users);
    }
});

socket.on('disconnect', function (msg){
    if(msg != undefined){
        console.log(msg);
        var appendStr = "<div class='alert alert-danger' role='alert'>" + msg.message + "</div>";
        var audio = new Audio('/assets/sound/out.mp3');
        audio.play();
        $('.chat').append($(appendStr));
        populateOnlineList(msg.users);
    }
});


function sendMessage() {
    var msg = $("#msg").val();
    socket.emit('message', msg, user);
    $("#msg").val('');
    $("#msg").focus();
    return false;
}

socket.on('message', function (msg) {
    var style = msg.style;
    var message = msg.message;
    var time = msg.date;
    var appendStr = "";
    var audio;
    switch (style) {
        case "message":
            var from = msg.from.name;
            var color = msg.from.color;
            if (from != null && from != user) {
                appendStr += "<li class='right clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + " '><b>" + from + "</b></strong><small class='text-muted'> <i> " + time + " </i></small></p></div><p>" + message + "</p></div></li>";
                audio =  new Audio('/assets/sound/stairs.mp3');
            }
            else {
                appendStr += "<li class='left clearfix'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + "><b>" + from + "</b></strong><small class='text-muted'><i><span style='color:" + color + "'>" + from + " (Yourself) </span> - " + time + "</i> <span class='far fa-clock'></span></small></p></div><p>" + message + "</p></div></li>";
                audio =  new Audio('/assets/sound/stairs.mp3');
            }
            break;
        default:
            break;
    }
    
    audio.play();
    $('.chat').append($(appendStr));
});

socket.on('typing', function (msg) {
    var message = msg.message;
    $("#typing").show();
    $("#typing").text(message).delay(2000).fadeOut();
});

socket.on('error', function (msg) {
    appendStr += "<div class='alert alert-danger' role='alert'>" + msg + "</div>";
    $('.chat').append($(appendStr));
});


function typeMsg(user) {
    socket.emit('typing', user);
}



function sendEnterMessage(e) {
    if (e.keyCode == 13) {
        document.getElementById("msgBtn").click();
        return false;
    }
}

function populateOnlineList(users){
    $('#onlineList').empty();
    console.log(users);
    var text =  "<li class='list-group-item'><b>Online Users</b></li>";
    users.forEach(x => {
        text += "<li class='list-group-item'><b><i class='fas fa-circle' style='color: #8af48c'></i> " + x.name + "</b></li>";
    });
    $('#onlineList').append($(text));
}