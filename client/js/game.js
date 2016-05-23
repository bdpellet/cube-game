var socket = io.connect('http://localhost:8080');

socket.on('test', function(data) {
  console.log('Server: ' + data);
});