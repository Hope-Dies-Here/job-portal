import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import passport from "passport";
import { jobs } from "../db/jobs.js";
import { User, Experience, Education } from "../models/User.js";
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
  const experiences = await Experience.findAll(user.id);
  const educations = await Education.findAll(user.id);
  console.log(user);
  res.render("profile", {
    user: req.isAuthenticated() ? user : null,
    experiences,
    educations,
    title: "Profile - JobHub",
  });
});

router.get("/profile/experience", async(req, res) => {
  try {
    const experience = await Experience.findAll(req.user.id);
    res.status(200).json({ data: experience })
  } catch(err) {
    console.log(err)
    res.status(500).json({ error: err, message: err.message })
  }
})

router.delete("/profile/experience/:id", async(req, res) => {
  try {
    await Experience.delete(req.params.id);
    const experiences = await Experience.findAll(req.user.id);

    res.status(200).render("partials/experiences",{
      experiences,
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting experience",
    });
    console.log(error);
  }
})

router.post("/profile/experience", async(req, res) => {
  try {
    
    await Experience.create({
      ...req.body,
      user_id: req.user.id
    });

    const experiences = await Experience.findAll(req.user.id);  

    res.status(200).render("partials/experiences", {
      experiences, 
    }, (err, html) => {
      res.json({ html, success: true, message: "Experience added successfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error.message",
    });
  }
})

router.post("/profile/education", async(req, res) => {
  try {
    
    console.log(req.body, "body");
    await Education.create({
      ...req.body,
      user_id: req.user.id
    });
    const educations = await Education.findAll(req.user.id);
    
    res.render("partials/educations-list", {
      educations,
    }, (err, html) => {
      res.json({ html, success: true, message: "Education added successfully" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error.message",
    });
    
  }
  
})

router.get("/saved-jobs", (req, res) => {
  const user = req.user;
  res.render("saved-jobs", {
    user: req.isAuthenticated() ? user : null,
    title: "Saved Jobs - JobHub",
  });
});

router.get("/applied-jobs", (req, res) => {
  const user = req.user;
  res.render("applied-jobs", {
    user: req.isAuthenticated() ? user : null,
    title: "Applied Jobs - JobHub",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/users/login");
});

export default router;
