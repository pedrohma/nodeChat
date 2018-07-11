var MongoClient = require('mongodb').MongoClient;

var url = "your_mongodb_cluster_url";

module.exports = {

    newUser: function(user){
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("users").insertOne(user, function (err, res) {
                if (err) throw err;
                console.log(user.message + " inserted");
                db.close();
            });
        });
    },

    newMsg: function(msg){
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("mydb");
            dbo.collection("messages").insertOne(user, function (err, res) {
                if (err) throw err;
                console.log("message inserted");
                db.close();
            });
        });
    }

}