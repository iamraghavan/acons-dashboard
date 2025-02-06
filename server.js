const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["*"],
            scriptSrc: ["*"],
            styleSrc: ["*", "'unsafe-inline'"],
            fontSrc: ["*"],
            imgSrc: ["*"],
            connectSrc: ["*"],
            objectSrc: ["*"],
            mediaSrc: ["*"],
            frameSrc: ["*"]
        }
    }
}));


app.use(compression());
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash Messages
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());

// View Engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));


// Routes
app.use('/', authRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
