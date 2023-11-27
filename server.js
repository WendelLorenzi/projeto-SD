require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const ngrok = require('ngrok');

const server = require('http').createServer(app);

const corsOptions = {
    origin: '*', 
    credentials: true,          
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

// const getHost = async () => {
//     const url = await ngrok.connect({authtoken: `${process.env.NGROK_AUTH}`, proto: 'http', addr: process.env.PORT });
//     console.log(`ngrok tunnel is running at ${url}`);
//     if(url) {
//         return url;
//     }
//     return 'http:localhost';
//  }


const io = require('socket.io')(server, {
    cors: false,
    allowEIO3: true
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'public'));

app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');

// const Host = getHost();
const Host = 'http://localhost'

app.get('/', (req, res) => {
    res.render('index.ejs', { host: Host });
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
            console.log('O ip ' + objIp.ip + ' é o usuário: ' + objIp.author);
            const userNick = messages.find(message => message.author === data.author);
            if(userNick != undefined) {
                console.log('nome ja exite');
                return null;
            }
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
        if (client === undefined) {
            client = pushUser(data);
            if(client != null) {
                const result = await setMessage(client, data);
                if (result !== null) {
                    messages.push(result);
                }
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