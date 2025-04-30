import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import passport from "passport";
import { jobs } from "../db/jobs.js";
import User from "../models/User.js";
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/jobs",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/register", (req, res) => {
  res.render("register", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.post("/register", (req, res) => {});

router.get("/profile", checkLogin, async (req, res) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  res.render("profile", {
    user: req.isAuthenticated() ? user : null,
    title: "Profile - JobHub",
  });
});

router.get("/profile/add-experience", async(req, res) => {
  
  res.render("add-experience", {
    user: req.isAuthenticated() ? req.user : null,
    title: "Add Experience - JobHub",
  });
})

router.post("/profile/add-experience", async(req, res) => {
  
  res.status(200).json({
    success: true,
    message: "Experience added successfully",
  });
})

router.get("/profile/add-education", async(req, res) => {
  
  res.render("add-education", {
    user: req.isAuthenticated() ? req.user : null,
    title: "Add Education - JobHub",
  });
})

router.get("/saved-jobs", (req, res) => {
  res.render("saved-jobs", {
    user: req.isAuthenticated() ? user : null,
    title: "Saved Jobs - JobHub",
  });
});
export default router;
