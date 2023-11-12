const express = require('express');

const path = require('path');

const app = express();

const PORT = 3000;

const HOST = '0.0.0.0';

const server = require('http').createServer(app);

const io = require('socket.io')(server, {
    allowEIO3: true
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(PORT, HOST);