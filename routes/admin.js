import express from "express";
const router = express.Router();

import { pool } from '../db/db.js'
import checkIp from "../middlewares/checkIp.js";
import { Job } from "../models/Job.js";
import Company from "../models/Company.js";
import { User } from "../models/User.js";

router.get("/login", checkIp, async (req, res) => {

    if (req.session.admin) {
        return res.redirect("/admin");
    }

    res.render("admin/login", {
        user: req.isAuthenticated() ? req.user : null,
        title: "Admin - JobHub",
    })
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const [rows] = await pool.execute("SELECT * FROM admin WHERE email = ? AND password = ?", [email, password]);
    if (rows.length > 0) {
        req.session.admin = rows[0];
        res.redirect("/admin");
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
})
router.get("/", async (req, res) => {
    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }
    const jobs = await Job.findAll();
    const companies = await Company.findAll();
    const users = await User.findAll();

    res.render("admin/index", {
        user: req.isAuthenticated() ? req.user : null,
        admin: req.session.admin,
        title: "Admin - JobHub",
        jobs,
        companies,
        users
    });
});

router.get("/jobs/edit/:id", async(req, res) => {
    const job = await Job.findById(req.params.id);
    console.log(job);
    res.render("admin/edit-job", {
        admin: req.session.admin,
        user: null,
        title: "Edit Job - JobHub",
        job
    });
})

router.get("/logout", (req, res) => {
    req.session.admin = null;
    res.redirect("/admin/login");
});
export default router;