import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";
import { jobs } from "./db/jobs.js";
import { pool, connectDb } from "./db/db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import passport from "passport";
import flash from "connect-flash";
import session from "express-session";
import LocalStrategy from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
dotenv.config();

//importing routes
import jobsRoute from "./routes/jobs.js";
import indexRoute from "./routes/index.js";
import usersRoute from "./routes/users.js";
import companiesRoute from "./routes/companies.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Middleware

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.ENV === "dev"
          ? process.env.GOOGLE_OAUTH_CB_LOCAL
          : process.env.GOOGLE_OAUTH_CB,
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile) {
          return done(new Error("Faild to fetch user profile"));
        }
        return done(null, profile);
      } catch (e) {
        console.log(e);
        return done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findByEmail(email);
      if (!user) return done(null, false, "Email not found");

      let match;
      // const match = await bcrypt.compare(password, user.password);
      password === user.password ? (match = true) : (match = null);
      if (!match) return done(null, false, "Password not correct");

      const { password: uhoh, ...safeData } = user;
      return done(null, safeData);
    }
  )
);

app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  next();
});
// General Error Handling Middleware (catch-all)
// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack); // Log the error for debugging

  // Check if the error is related to OAuth
  if (err.name === "InternalOAuthError") {
    return res.status(500).json({
      success: false,
      message: "Failed to authenticate with Google. Please try again later.",
    });
  }

  // Handle other types of errors
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
});

// database connection
connectDb();

// Routes
app.use("/", indexRoute);
app.use("/jobs", jobsRoute);
app.use("/users", usersRoute);
app.use("/companies", companiesRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
