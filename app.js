const express = require('express');
const app = express();
const fs = require('fs');

require('dotenv').config();

app.use(express.static(__dirname + "/public"));
const authRoutes = require('./routes/auth.js');

app.use(authRoutes);

const homePage = fs.readFileSync(__dirname + '/public/home/home.html').toString();
const aboutPage = fs.readFileSync(__dirname + '/public/about/about.html').toString();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/home', (req, res) => {
    res.send(homePage);
});

app.get('/about', (req, res) => {
    res.send(aboutPage);
});

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) { throw err };
    console.log(`Server running on port: ${port}`)
});