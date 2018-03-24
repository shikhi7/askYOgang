var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
var mysql = require('mysql');

app.use(express.static(path.join(__dirname, '/cssFiles')))
app.use(express.static(path.join(__dirname, '/actions')))

userActive = {}

app.get('/home', function(req, res){
    // TODO :: build authentication check here
  res.sendFile(__dirname + '/htmlFiles/index.html');
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/htmlFiles/login.html');
});

let con = mysql.createConnection({
  host: "localhost",
  user: "user",
  password: "pass",
  database: "database"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
})

io.on('connection', function(socket){

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('login_credentials', function(username, pass){
      let sql_query = "SELECT * FROM askYogang WHERE username='" +
                      username+"' AND pass='"+pass + "';";
      con.query(sql_query, function (err, result) {
        if (err) throw err;
        if(result.length > 0)
          io.emit('accessAllowed', '/home');
        else
          io.emit('accessDenied', '/');
        
      });
    });


  socket.on('register_credentials', function(username, pass){
      // TODO :: Check whether the username is distinct
      let sql_query = "INSERT INTO askYogang (username, pass) VALUES ('" +
                        username+"','" + pass + "')";
      con.query(sql_query, function (err, result) {
          if (err) throw err;
          console.log("New member added: " + username);
          io.emit('accessAllowed', '/home');
      });
    });
})


http.listen(3000, function(){
  console.log('listening on *:3000');
});
