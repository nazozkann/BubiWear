const path = require('path');
const express = require('express');
const ejs = require('ejs');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const { imageUploadErrorHandler, handleErrors } = require('./middlewares/error-handler'); // Destructure the correct functions
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const authRoutes = require('./routes/auth-routes');
const productsRoutes = require('./routes/products-routes');
const baseRoutes = require('./routes/base-routes');
const adminRoutes = require('./routes/admin-routes');
const cartRoutes = require('./routes/cart-routes'); // Include the cart routes

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/products/assets', express.static(path.join(__dirname, 'product-data'))); // Ensure correct path
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use(cartMiddleware);

app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes); // Ensure this is included
app.use('/cart', cartRoutes); // Include the cart routes
app.use(protectRoutesMiddleware);
app.use('/admin', adminRoutes);

// Add the error handlers
app.use(handleErrors);

db.connectToDatabase()
.then(function(){
    app.listen(3000); // Changed port to 3000
})
.catch(function(error){
    console.log('Failed to connect to the database!');
    console.log(error);
});