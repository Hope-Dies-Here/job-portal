import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import passport from "passport";
import { jobs } from "../db/jobs.js";
import { User, Experience } from "../models/User.js";
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

router.post("/profile/personal", checkLogin, async(req, res) => {
  const body = req.body;
  console.log(body, "body");

  const user = await User.findByIdAndUpdate(req.user.id, body);
  res.status(200).json({ success: true, data: user })
})


router.get("/register", (req, res) => {
  res.render("register", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? user : null,
    title: "JobHub - Find Your Dream Job",
  });
});

router.post("/register", async (req, res) => {
  const body = req.body;
  const { first_name, last_name, email, password } = req.body;
  console.log(body);

  const data = await User.create(req.body)
  if(!data) {
    res.redirect("/reister")
  }

  req.flash("success", "User created");

  res.redirect("/users/login");

});

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
  try {
    console.log(req.body, "body");
    const updatedExp = await Experience.create({
      ...req.body,
      user_id: req.user.id
    })
    res.status(200).json({
      success: true,
      message: "Experience added successfully",
      data: updatedExp
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error adding experience",
    });
  }
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
