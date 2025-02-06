const { body, validationResult } = require('express-validator');
const { auth } = require('../config/firebase');

exports.loginUser = [
    // Validation & Sanitization
    body('email').trim().isEmail().normalizeEmail().withMessage('Enter a valid email'),
    body('password').trim().notEmpty().withMessage('Password is required'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(err => err.msg));
            return res.redirect('/');
        }

        const { email, password } = req.body;

        try {
            // Firebase sign-in (using the Admin SDK)
            const userRecord = await auth.getUserByEmail(email);
            if (!userRecord) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/');
            }

            // Store user session
            req.session.user = {
                uid: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName || 'User'
            };

            res.redirect('/dashboard');
        } catch (error) {
            console.error('❌ Firebase Auth Error:', error);
            req.flash('error', 'Invalid email or password');
            res.redirect('/');
        }
    }
];

// Middleware to Protect Dashboard
exports.ensureAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    next();
};

// Middleware to Prevent Logged-In Users from Accessing Login Page
exports.preventLoginAccess = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    next();
};

// Dashboard Route
exports.dashboardPage = (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.session.user });
};

// Logout Function
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
