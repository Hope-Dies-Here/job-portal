import express from "express"
import { fileURLToPath } from "url"
import { dirname } from "path"
import { jobs } from './db/jobs.js';
// import { pool, connectDb } from './db/db.js'
import dotenv from 'dotenv';

import passport from 'passport';
import session from 'express-session';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config()

//importing routes
import jobsRoute from './routes/jobs.js';
import indexRoute from './routes/index.js';
import usersRoute from './routes/users.js';
import companiesRoute from './routes/companies.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 3001

// Middleware

app.use(express.static("public"))
app.set("view engine", "ejs")

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.ENV === 'dev' ? process.env.GOOGLE_OAUTH_CB_LOCAL : process.env.GOOGLE_OAUTH_CB 
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      if(!profile) {
        return done(new Error('Faild to fetch user profile'))
      }
      return done(null, profile)
    } catch(e) {
      console.log(e);
      return done(error)
    }
  }
))

// General Error Handling Middleware (catch-all)
// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack); // Log the error for debugging

  // Check if the error is related to OAuth
  if (err.name === 'InternalOAuthError') {
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google. Please try again later.',
    });
  }

  // Handle other types of errors
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred. Please try again later.',
  });
});

// database connection
// connectDb()

// Routes
app.use('/', indexRoute)
app.use('/jobs', jobsRoute)
app.use('/user', usersRoute)
app.use('/companies', companiesRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


