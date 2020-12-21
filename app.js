const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.static(__dirname + "/public"));
const authRoutes = require('./routes/auth.js');

app.use(authRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
const port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (err) { throw err };
    console.log(`Server running on port: ${port}`)
});