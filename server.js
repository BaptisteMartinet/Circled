/*
#
# Server
#
*/

const express = require('express');
const socketIO = require('socket.io');

var app = express()
var server = app.listen(process.env.PORT || 3000)
app.use(express.static('public'));
var io = socketIO(server)

console.log('Server running...')


io.sockets.on('connection', (socket) => {
  console.log('new user:', socket.id);

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected.')
  });
});