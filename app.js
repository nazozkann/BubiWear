const path = require('path');
const express = require('express');
const ejs = require('ejs');

const authRoutes = require('./routes/auth-routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.use(authRoutes);

app.listen(3000);