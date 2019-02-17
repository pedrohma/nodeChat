var users = [];
var colors = ["#d77ee7", "#7ea0e7", "#7ee7bf", "#7ee795", "#c9ff00", "#ffc100", "#8245e3", "#8245e3", "#900303", "#f6b045"];

function GetColor() {
    if (colors.length <= 0) {
        return "No color available.";
    }
    var num = Math.floor((Math.random() * colors.length));
    var color = colors[num];
    var index = colors.indexOf(num);
    colors.splice(index, 1);
    return color;
}

function UsernameIsAvailable(name){
    var user = null;

    if (name != undefined) {
        for (i = 0; i < users.length; i++) {
            if (users[i].name == name) {
                user = users[i];
            }
        }
    }

    return user == null;
}

function GetUser(name) {
    var user = null;

    if (name != undefined) {
        for (i = 0; i < users.length; i++) {
            if (users[i].name == name) {
                user = users[i];
            }
        }
    }

    return user;
}

function RemoveUser(name) {
    if (name != undefined) {
        // adding color back
        var user = GetUser(name);
        if(user != undefined){
            colors.push(user.color);
            // removing user from the list
            var index = users.indexOf(name);
            users.splice(index, 1);
        }
    }
}

function GetUsers() {
    return users;
}

function AddUser(name) {
    users.push(name);
}

module.exports.GetColor = GetColor;
module.exports.GetUser = GetUser;
module.exports.RemoveUser = RemoveUser;
module.exports.GetUsers = GetUsers;
module.exports.AddUser = AddUser;
module.exports.UsernameIsAvailable = UsernameIsAvailable;