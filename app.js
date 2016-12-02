var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var names = [];

app.get('/', function(req, res){
  res.sendfile('index.html');
});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');

  socket.on('new user', function(data){
  	socket.name = data;
  	names.push(socket.name);
  	io.sockets.emit('usernames', names);
  });

  socket.on('send name', function(data){
  	io.sockets.emit('header',{usr: socket.name});
  });

  socket.on('send message', function(data){
  	io.sockets.emit('new message', {msg: data, usr: socket.name});
  });

  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
    if(!socket.name) return;
    names.splice(names.indexOf(socket.name), 1);
    io.sockets.emit('usernames', names);

  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});