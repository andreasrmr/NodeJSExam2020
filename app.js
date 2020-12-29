const express = require('express');
const app = express();
const fs = require('fs');

require('dotenv').config();

//Bruges til POST og PUT til at retrieve data. eks. med req.body
app.use(express.urlencoded({extended: true}))
app.use(express.json());    
app.use(express.static(__dirname + "/public"));

const authRoutes = require('./routes/auth.js');
app.use(authRoutes);

const headerPage = fs.readFileSync(__dirname + '/public/header/header.html').toString();
const indexPage = fs.readFileSync(__dirname + '/public/index/index.html').toString();
const homePage = fs.readFileSync(__dirname + '/public/home/home.html').toString();
const aboutPage = fs.readFileSync(__dirname + '/public/about/about.html').toString();
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html').toString();

app.get('/', (req, res) => {
    return res.send(headerPage + indexPage + footerPage);
});

app.get('/home', (req, res) => {
    return res.send(homePage);
});

app.get('/about', (req, res) => {
    return res.send(aboutPage);
});

app.get("/*", (req, res) => {
    return res.redirect("/");
});

const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) { throw err };
    console.log(`Server running on port: ${port}`);
});