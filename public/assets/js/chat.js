var socket = io();

var user = "";

$(document).ready(function () {
    $("#enterModal").modal({ backdrop: 'static', keyboard: false });
    $("#loginErrorDiv").hide();
});

function enterChat() {
    user = $("#username").val();
    socket.emit('checkUser', user);
}

socket.on('userlist', function (users) {
    populateOnlineList(users);
});

socket.on('joinsuccess', function (msg) {
    if (msg != undefined) {
        $("#enterModal").modal('hide');
        socket.emit('userlist');
        var appendStr = "<li class='alert alert-success' role='alert'>" + msg.message + "</li>";
        var audio = new Audio('/assets/sound/new.mp3');
        audio.play();
        $('.chat').append($(appendStr));
        populateOnlineList(msg.users);
    }
});

socket.on('disconnect', function (msg) {
    if (msg != undefined && msg.message != undefined) {
        // console.log(msg);
        var appendStr = "<li class='alert alert-danger' role='alert'>" + msg.message + "</li>";
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
    var unique = "" + new Date().getMilliseconds();
    unique += "_" + new Date().getMilliseconds();
    switch (style) {
        case "message":
            var from = msg.from.name;
            var color = msg.from.color;
            if (from != null && from != user) {
                appendStr += "<li class='right clearfix' id='" + unique + "'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + " '><b>" + from + "</b></strong><small class='text-muted'> <i><span class='time-chat'>(" + time + ")</span></i></small></p></div><p>" + message + "</p></div></li>";
                audio = new Audio('/assets/sound/stairs.mp3');
            }
            else {
                appendStr += "<li class='left clearfix' id='" + unique + "'><div class='chat-body clearfix'><div class='header'><p><strong class='pull-right' style='color: " + color + "><b>" + from + "</b></strong><small class='text-muted'><i><span style='color:" + color + "'>" + from + " </span><span class='time-chat'>(" + time + ")</span></i></small></p></div><p>" + message + "</p></div></li>";
                audio = new Audio('/assets/sound/stairs.mp3');
            }
            break;
        default:
            break;
    }

    audio.play();
    // var last = $('.chat').append($(appendStr));
    $(appendStr).appendTo(".chat");
    // console.log(unique);
    // $("#" + unique).focus();
    $('.chat')[0].scrollTop = $('.chat')[0].scrollHeight;
    // $('.chat').animate({scrollTop: last.offset().top }, '500', 'swing', function() {});
    
});

socket.on('typing', function (msg) {
    $("#typing").show();
    $("#typing").text(msg.message).delay(2000).fadeOut();
});

socket.on('joinerror', function (msg) {
    $("#loginErrorMsg").empty();
    $("#loginErrorDiv").show();
    $("#loginErrorMsg").text(msg.err);
    $("#loginErrorDiv").delay(2000).fadeOut();
});


function typeMsg() {
    socket.emit('typing', user);
}

function sendEnterMessage(e) {
    if (e.keyCode == 13) {
        document.getElementById("msgBtn").click();
        return false;
    }
}

function populateOnlineList(users) {
    if (users != undefined && users.length > 0) {
        $('#onlineList').empty();
        $('#onlineListMob').empty();
        var text = "<li class='list-group-item'><a href='#' onclick='showList()' id='titleAnchor'><b><i class='fas fa-users'></i><span id='titleList'>Online Users</span></b></a></li>";
        users.forEach(x => {
            text += "<li class='obc list-group-item'><b><i class='fas fa-circle' style='color: #8af48c;'></i> " + x.name + "</b></li>";
        });
        $('#onlineList').append($(text));
        $('#onlineListMob').append($(text));
    }
}

function showList() {
    var element = document.getElementById("titleAnchor");
    var elementStyle = element.style;
    var computedStyle = window.getComputedStyle(element, null);

    for (prop in elementStyle) {
        if (elementStyle.hasOwnProperty(prop)) {
            if (prop == 'color') {
                if (computedStyle[prop] == 'rgb(51, 204, 255)') {
                    $("#mobListMod").modal();
                }
            }
        }
    }
}