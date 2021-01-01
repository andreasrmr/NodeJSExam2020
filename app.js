const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//Bruges til POST og PUT til at retrieve data. eks. med req.body
app.use(express.urlencoded({extended: true}))
app.use(express.json());    
app.use(express.static(__dirname + '/public'));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

const authRoutes = require('./routes/auth.js');
app.use(authRoutes);

const userRoutes = require('./routes/user.js');
app.use(userRoutes)

const headerPage = fs.readFileSync(__dirname + '/public/header/header.html').toString();
const indexPage = fs.readFileSync(__dirname + '/public/index/index.html').toString();
const homePage = fs.readFileSync(__dirname + '/public/home/home.html').toString();
const aboutPage = fs.readFileSync(__dirname + '/public/about/about.html').toString();
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html').toString();
const chatPage = fs.readFileSync(__dirname + '/public/chat/chat.html').toString();

app.get('/', (req, res) => {
    return res.send(headerPage + indexPage + footerPage);
});

app.get('/home', (req, res) => {
    return res.send(homePage);
});

app.get('/about', (req, res) => {
    return res.send(aboutPage);
});

app.get('/chat', authenticateToken, (req, res) => {
    return res.send(chatPage);
});

app.get('/*', (req, res) => {
    return res.redirect('/');
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) { return res.sendStatus(401) }
        req.user = user;
        next(); 
    });
};

//chat
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const escapeHtml = require('escape-html');

io.on('connection', (socket) => {
    socket.on('client changed color', ({ data }) => {
        // broadcasts to all sockets in this namespace
        //io.emit('server sending the color', { data: data });

        // only emits to the socket in this very callback
        // socket.emit('server sending the color', { data: data });

        // sends data to all but not itself
        socket.broadcast.emit('server sending the color', { data: data });
    });

    socket.on('client submits chat message', ({ data }) => {
        io.emit('server sends the chat message', { data: escapeHtml(data) });
    });

    socket.on('disconnect', () => {
        // console.log('A socket disconnected. byeeeeeee');
    });
});

const port = process.env.PORT || 3000

server.listen(port, (err) => {
    if (err) { throw err };
    console.log(`Server running on port: ${port}`);
});