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
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "https://code.jquery.com",
                "https://cdn.jsdelivr.net",
                "https://stackpath.bootstrapcdn.com",
                "'unsafe-inline'"  // Allow inline scripts (less secure)
            ],
            scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Allow inline event handlers (less secure)
            styleSrc: [
                "'self'",
                "https://stackpath.bootstrapcdn.com",
                "https://cdnjs.cloudflare.com", // Allow FontAwesome from CDNJS
                "'unsafe-inline'"  // Allow inline styles
            ],
            fontSrc: [
                "'self'",
                "https://stackpath.bootstrapcdn.com",
                "https://cdnjs.cloudflare.com", // Allow FontAwesome fonts from CDNJS
                "data:" // Allow fonts from data URIs
            ],
            imgSrc: ["'self'", "https://ui-avatars.com"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
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
