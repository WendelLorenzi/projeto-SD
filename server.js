require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const os = require('os');
const cors = require('cors');

const server = require('http').createServer(app);

const networkInfo = os.networkInterfaces();

const getAddress = () => {
    if(`${process.env.NODE_ENVIRONMENT}` === 'prod') {
        let interface = networkInfo['eth0'];
        if(interface) {
            console.log('Endereço da eth0:', interface[0].address);
            return interface[0].address;
        }
    } else {
        let interface = networkInfo['Wi-Fi'];
        if(interface) {
            console.log('Endereço dao wifi:', interface[3].address);
            return interface[3].address;
        }
    }
}

const endereco = getAddress();

const io = require('socket.io')(server, {
    cors: false,
    allowEIO3: true
});



app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');



app.get('/', (req, res) => {
    res.render('index.ejs', { host: `${endereco}`, port: process.env.PORT });
});



let messages = [];
let userIP = [];

io.on('connection', socket => {
    console.log('entrou socket');
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
                    const obj = { author: client.author, message: data.message, dateTime: data.dateTime };
                    if (client && obj) {
                        resolve(obj);
                    }
            } else {
                resolve(null);
            }
        });
    }

    socket.on('sendMessage', async data => {
        let client = getClient(clientIp);
        console.log('data sendMessage server', data);
        if (client === undefined) {
            client = pushUser(data);
            const result = await setMessage(client, data);
            if (result !== null) {
                messages.push(result);
            }
        } else {
            const result = await setMessage(client, data);
            if (result !== null) {
                messages.push(result);
            }
        }
        socket.broadcast.emit('receivedMessage', messages);
        console.log('messages', messages);
    });

    socket.emit('previousMessages', messages);
});

server.listen(process.env.PORT, process.env.HOST);