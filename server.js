require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const server = require('http').createServer(app);
const PORT = 8080;

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    allowEIO3: true
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index.ejs', { host: process.env.NODE_HOST, port: PORT});
});



let messages = [];
let userIP = [];


io.on('connection', socket => {
    const clientIp = socket.handshake.headers['x-real-ip'] || socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    console.log('Endereço IP do cliente conectado: ' + clientIp);
    const getClient = (clientIp) => {
        return userIP.find(i => i.ip === clientIp && i.author !== undefined);
    };

    const pushUser = (data) => {
        if (data.author != undefined) {
            const objIp = { ip: clientIp, author: data.author };
            // messages.push({author: data.author, message: data.message})
            if (objIp.ip && objIp.author) {
                userIP.push(objIp);
                // socket.emit('userProfile', objIp);
                return objIp;
            }
        }
        if (client != undefined) {
            const obj = { author: client.author, message: data.message };
            if (client && obj) {
                messages.push(obj);
            }
            return client;
        }
    };

    const setMessage = (client, data) => {
        return new Promise((resolve) => {
            if (client != undefined && client.author) {
                // recebendo mensagens
                    const obj = { author: client.author, message: data.message };
                    if (client && obj) {
                        resolve(obj);
                    }
            } else {
                resolve(null);
            }
        });
    }

    let client = getClient(clientIp);

    socket.on('sendMessage', async data => {
        if (client === undefined) {
            client = pushUser(data);
            const result = await setMessage(client, data);
            if (result !== null) {
                messages.push(result);
                // emite as mudanças na variavel messages
                socket.broadcast.emit('stateChanged', messages);
            }
        } else {
            const result = await setMessage(client, data);
            if (result !== null) {
                messages.push(result);
                socket.broadcast.emit('stateChanged', messages);
            }
        }
    });

    socket.emit('previousMessages', messages);

});
server.listen(PORT, `${process.env.NODE_HOST}`);