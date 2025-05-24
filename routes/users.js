import bcrypt from 'bcrypt';

import express from "express";
import checkLogin from "../middlewares/checkLogin.js";
import passport from "passport";
import { jobs } from "../db/jobs.js";
import { User, Experience, Education, Adress } from "../models/User.js";
import { uploadMiddleware, upload } from "../middlewares/multer.js";
import tesseract from "tesseract.js";
import { Application } from "../models/Application.js";
import { pool } from "../db/db.js";
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login", {
    job: jobs[0],
    jobs,
    user: req.isAuthenticated() ? req.user : null,
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
  if(!user) {
    return res.status(400).json({ success: false, message: "User not found" })
  }
  // console.log("ere beyene", await User.findById(req.user.id))
  req.user = await User.findById(req.user.id);
  // console.log(req.user, "user");
  // console.log(req.user.last_name, "user");

  req.flash("success", "User updated");
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

  const hashedPassword = await bcrypt.hash(password, 10);
  req.body.password = hashedPassword;

  const data = await User.create(req.body)
  console.log(data);
  await pool.execute(
    "INSERT INTO address(user_id) VALUES (?)", [data.insertId]
  )
  if(!data) {
    return res.redirect("/users/register")
  }

  req.flash("success", "User created");

  res.redirect("/users/login");

});

router.get("/applications", checkLogin, async (req, res) => {
  const applications = await Application.findAll(req.user.id);
  
  res.render("applications", {
    applications,
    user: req.isAuthenticated() ? req.user : null,
    title: "Applications - JobHub",
  });
})


router.get("/profile", checkLogin, async (req, res) => {
  console.log(req.user.id);
  const user = await User.findById(req.user.id);
  console.log(user, "beyene");
  const experiences = await Experience.findByUserId(req.user.id);
  const educations = await Education.findByUserId(req.user.id);
  const applications = await Application.findByUserId(req.user.id);
  console.log(user, "BEYENEN");
  res.render("profile", {
    user: req.isAuthenticated() ? user : null,
    experiences: experiences || [],
    educations: educations || [],
    applications: applications || [],
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

router.post("/profile/education", upload.single('image'), async(req, res) => {
  try {
    console.log(req.file, "file");
    const { path: imagePath } = req.file;
    const { data: { text } } = await tesseract.recognize(imagePath, 'eng', {
        // logger: m => console.log(m)
    });
    console.log(text);
    
    if(!text.toLocaleLowerCase().includes(`${req.user.first_name.toLocaleLowerCase()} ${req.user.last_name.toLocaleLowerCase()}`)) {
      return res.status(400).json({ success: false, message: "We couldn't detect your name on your tempo." });
    }

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
      message: "Error try again.",
    });
    
  }
  
})

router.delete("/profile/educations/:id", async(req, res) => {
  try {
    const deleted = await Education.delete(req.params.id);
    console.log(req.params.id);
    console.log(deleted);
    const educations = await Education.findAll(req.user.id);

    res.status(200).render("partials/educations-list",{
      educations,
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting experience",
    });
    console.log(error);
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
  // req.logout();
  req.session.destroy();
  res.redirect("/users/login");
});

export default router;
