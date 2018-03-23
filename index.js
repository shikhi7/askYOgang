var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');
var mysql = require('mysql');

app.use(express.static(path.join(__dirname, '/public')))

app.get('/home', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});

let con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "password",
  database: "database-name"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
})

io.on('connection', function(socket){
  console.log('Yo! A user got connected, or maybe not ;)');
  socket.on('disconnect', function(){
  	console.log('No! A user got disconnected, or maybe not ;)');
  });
  socket.on('chat message', function(msg){
  	console.log('message: ' + msg);
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('login_credentials', function(username, pass){
      let sql_query = "SELECT * FROM askYogang WHERE username='" +
                      username+"' AND pass='"+pass + "';";
      con.query(sql_query, function (err, result) {
          if (err) throw err;
          if(result.length > 0)
            // TODO :: fetch the next page
            io.emit('accessAllowed', 'you are allowed, baby');
          else io.emit('accessDenied', 'Stay Away!!');
      });
    });


  socket.on('register_credentials', function(username, pass){
      // TODO :: Check whether the username is distinct
      let sql_query = "INSERT INTO askYogang (username, pass) VALUES ('" +
                        username+"','" + pass + "')";
      con.query(sql_query, function (err, result) {
          if (err) throw err;
          // TODO :: fetch the next page
          io.emit('accessAllowed', 'you are allowed, baby');
      });
    });

})


http.listen(3000, function(){
  console.log('listening on *:3000');
});
