var express=require('express');
var app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path=require('path');

app.use(express.static(path.join(__dirname, '/public')))
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname+'/public'));

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
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
