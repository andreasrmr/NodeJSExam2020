const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

require('dotenv').config();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
    //broadcast til alle andre undtagen sig selv.
    socket.broadcast.emit('chat message', 'New user connected');
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
});

//Broadcast
//io.emit('welcome new connection', {someProperty: 'some value', otherProperty: 'other Value' });

const port = 3000;
http.listen(port, (err) => {
    if(err)  { throw err; }
    console.log(`Server running on port: ${port}`)
});
