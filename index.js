var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('Yo! A user got connected, or maybe not ;)');
  socket.on('disconnect', function(){
  	console.log('No! A user got disconnected, or maybe not ;)');
  })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});