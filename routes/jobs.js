import { GoogleGenAI } from "@google/genai";
import express, { response } from "express";
const router = express.Router();

import { pool } from '../db/db.js'
import checkLogin from "../middlewares/checkLogin.js";
import { Job, Category, JobCategory } from "../models/Job.js";
import { User } from "../models/User.js";
import { Application } from "../models/Application.js";

router.get("/", async (req, res) => {
  try {
  const jobs = await Job.findAll();
  console.log(jobs);
  res.render("index", {
    // jobs: temp_jobs.reverse(),
    jobs: jobs.reverse(),
    user: req.isAuthenticated() ? req.user : null,
    title: "JobHub - Listed Jobs",
  });
} catch (error) {
  console.log(error);
  res.status(500).json({ success: false, message: error.message });
}
});

router.get("/search", async (req, res) => {
  const [jobs] = await pool.execute('SELECT * FROM jobs WHERE title LIKE ? ORDER BY id ASC', [`%${req.query.q}%`])
  const categories = await Category.findAll();
  const result = jobs.filter((job) => job.title.includes(req.query.q));
  // console.log(req.query.q)
  res.render("search", {
    title: "Search Jobs - JobHub",
    jobs,
    user: req.isAuthenticated() ? req.user : null,
    queryData: req.query,
    categories
  });
});

router.get("/:id", async (req, res) => {
  const jobId = req.params.id;
  const job = await Job.findById(jobId);
  const [requirements] = await pool.execute('SELECT * FROM requirements WHERE job_id = ?', [jobId]);
  console.log(requirements);
  if(!job) {
    return res.status(404).render("404", {
      title: "Job Not Found",
      user: req.isAuthenticated() ? req.user : null,
    });
  }
  console.log(job);
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
  let existingApplication = null
  if(req.isAuthenticated()) {

    existingApplication = await Application.findExistingApplication(req.user.id, req.params.id)
  }

  res.render("test", {
    job,
    similarJobs,
    user: req.isAuthenticated() ? req.user : null,
    title: `${job.title} - JobHub`,
    existingApplication,
  });
});

// apply for a job
router.get("/:id/apply", checkLogin, async (req, res) => {
   const existingApplication = await Application.findExistingApplication(req.user.id, req.params.id)

    if(existingApplication.length > 0) {
      req.flash("error", "You already applied for this job");

      return res.render("apply-error", {
        title: "Jobhub - Bad Request",
        user: req.user
      })
    }
  const [jobs] = await Job.findAll();
  const job = await Job.findById(req.params.id);
  console.log("---------------------");
  console.log(job);
  console.log("---------------------");

  if (!job) {
    return res.status(404).render("404", {
      title: "Job Not Found",
      user: req.isAuthenticated() ? req.user : null,
    });
  }
  const profile = await User.findById(req.user.id)
  // console.log(profile);
  res.render("apply", {
    job,
    jobs,
    user: req.isAuthenticated() ? profile : null,
    title: `${job.title} - JobHub`,
  });
});

router.post("/:id/apply", checkLogin, async (req, res) => {
  // res.render("")
  try {


    const existingApplication = await Application.findExistingApplication(req.user.id, req.params.id)

    if(existingApplication.length > 0) {
      return res.status(401).json({ error: "You can't apply multiple times for one job" })
    }

    const { resume } = req.body;
    const response = await Application.create({
      job_id: req.params.id,
      user_id: req.user.id,
      resume 
    });
    console.log(response);
    res.redirect("/users/applications");
    // res.json(response);
  } catch(e) {
    res.status(500).json({ msg: "Server Error", err: e.message })
  }
  
})

// post job
router.post("/post", async (req, res) => {
  const user = req.user;
  console.log(req.body);
  try {
    const job = await Job.create({
      title: req.body.title,
      type: req.body.type,
      description: req.body.description,
      company: parseInt(req.body.company),
      location: req.body.location,
      salary: req.body.salary,
      responsibilities: req.body.responsibilities.replace(/\n/g, '.'),
      end_date: req.body.end_date,
      posted_date: new Date(),
      requirements: req.body.degree,
    });

    if(!job.insertId) {
      return res.status(500).json({ success: false, message: "Job not posted" });
    }

    let categories = req.body.categories;
    if(!categories) {
      categories = [];
    }

    if(typeof categories === "string") {
      categories = [categories];
    }
    console.log("Categories", categories);
    categories.forEach(async (tag) => {
      
      await JobCategory.create({
        job_id: job.insertId,
        cat_id: parseInt(tag),
      });
    });

    // add requirements degree	field_of_study	cgpa	exit_score	experiance	skill	other	job_id	

    // const requirements = {
    //   degree: req.body.degree,
    //   field_of_study: req.body.field_of_study,
    //   cgpa: req.body.cgpa,
    //   exit_score: req.body.exit_score,
    //   experience: req.body.experience,
    //   skill: req.body.skill,
    //   other: req.body.other,
    //   job_id: job.insertId,
    // }
    
    console.log(job.insertId, req.body.degree, req.body.field_of_study, req.body.cgpa, req.body.exit_score, req.body.experience, req.body.technical_skill, req.body.additional_requirements);
    const [data] = await pool.execute(
      "INSERT INTO requirements (job_id, degree, field_of_study, cgpa, exit_score, experience, skill, other) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [job.insertId, req.body.degree, req.body.field_of_study, req.body.cgpa, req.body.exit_score, req.body.experience, req.body.technical_skills, req.body.additional_requirements]
    );
    console.log("Requirements", data);
    // console.log(req.body);
    // console.log(req.body.responsibilities.split("\n").map((item) => item.trim()).filter((i) => i !== ""));

    req.flash("success", "Job posted successfully");
    res.status(201).json({ success: true, message: "Job posted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
);

router.get("/generate-cv", async (req, res) => {



const ai = new GoogleGenAI({ apiKey: "AIzaSyC7_Mqx2lJLmLoI-GlL-_QyxU16jGqsei8" });

async function main(body) {
  console.log("object");
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: body,
  });
  console.log(response.text);
  return response.text
}

  const text = await main(req.body);
  console.log(text);
  res.status(200).json({ success: true, message: "CV generated successfully", data: text });
})


export default router;
