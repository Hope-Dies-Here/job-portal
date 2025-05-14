import express from "express";
const router = express.Router();

import { pool } from '../db/db.js'

import checkLogin from "../middlewares/checkLogin.js";
import { Job, Category, JobCategory } from "../models/Job.js";
import { User } from "../models/User.js";

router.get("/", async (req, res) => {
  try {
  const jobs = await Job.findAll();
  
  console.log("JOB",jobs);
  res.render("index", {
    // jobs: temp_jobs.reverse(),
    jobs,
    user: req.isAuthenticated() ? req.user : null,
    title: "JobHub - Listed Jobs",
  });
} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: error.message });
}
});

router.get("/search", async (req, res) => {
  const [jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC')
  const result = jobs.filter((job) => job.title.includes(req.query.q));
  // console.log(req.query.q)
  res.render("search", {
    title: "Search Jobs - JobHub",
    jobs: result,
    user: req.isAuthenticated() ? req.user : null,
    queryData: req.query,
  });
});

router.get("/:id", async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);
  const similarJobs = await Job.findSimilarJobs(job.id);
  console.log(similarJobs);

  // const [temp_jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC')

  // const job = jobs.find((job) => job.id === jobId);
  // const job = temp_jobs.find(j => j.id == jobId);
  if (!job) {
    return res.status(404).render("404", {
      title: "Job Not Found",
      user: req.isAuthenticated() ? req.user : null,
    });
  }

  // const similarJobs = jobs  
  //   .filter(
  //     (j) =>
  //       j.id !== jobId &&
  //       j.categories.some((cat) => job.categories.includes(cat))
  //   )
  //   .slice(0, 3);

  // res.render("job-details", {job, similarJobs, title: `${job.title} - JobHub` });
  res.render("test", {
    job,
    similarJobs,
    user: req.isAuthenticated() ? req.user : null,
    title: `${job.title} - JobHub`,
  });
});

// apply for a job
router.get("/:id/apply", checkLogin, async (req, res) => {
  const [jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC')
  const job = jobs.find((job) => job.id == req.params.id);
  const profile = await User.findById(req.user.id)
  console.log(profile);
  res.render("apply", {
    job,
    jobs,
    user: req.isAuthenticated() ? profile : null,
    title: `${job.title} - JobHub`,
  });
});

// post job
router.post("/post", async (req, res) => {
  const user = req.user;
  console.log(req.body);
  try {
    const job = await Job.create({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      company: 1,
      location: req.body.location,
      salary: req.body.salary,
      responsibilities: req.body.responsibilities,
      requirements: req.body.requirements,
      end_date: req.body.end_date,
      posted_date: new Date(),
    });

    const categories = req.body.categories;
    console.log(categories);
    categories.forEach(async (tag) => {
      
      await JobCategory.create({
        job_id: job.insertId,
        cat_id: parseInt(tag),
      });
    });
    
    console.log(req.body);
    console.log(JSON.stringify(req.body.categories))
    req.flash("success", "Job posted successfully");
    res.status(201).json({ success: true, message: "Job posted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
);

export default router;
