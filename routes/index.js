import express from "express";
const router = express.Router();
import passport from "passport";
import { jobs } from "../db/jobs.js";
import saveReturnTo from "../middlewares/saveReturnTo.js";
import { User } from "../models/User.js";

const db = [];
router.get("/", (req, res) => {
  // const companies = await Company.findAll();
  res.render("landing", {
    jobs,
    user: req.isAuthenticated() ? req.user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.get("/home", (req, res) => {
  res.render("index", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? req.user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.get("/test", (req, res) => {
  
  res.render("test", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? req.user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const user = req.user;
    const existingUser = await User.findByEmail(user._json.email);
    console.log(req.user);
    if(!existingUser) {
      const newUser = await User.create({
        first_name: user._json.given_name,
        last_name: user._json.family_name,
        email: user._json.email,
        image: user._json.picture,
        auth_providor: "google"
      });
      console.log("user created");
    }
    // req.session.db = db;
    // console.log(req.user);
    req.user = await User.findByEmail(user._json.email);
    console.log(req.user);
    res.redirect("/users/profile");
  }
);
export default router;
