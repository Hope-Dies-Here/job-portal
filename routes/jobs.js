import express from 'express';
const router = express.Router();

// import { pool } from '../db/db.js'
import { jobs } from '../db/jobs.js';
import checkLogin from '../middlewares/checkLogin.js';

router.get('/', async (req, res) => {
  // const [temp_jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC') 

  res.render('index', {
    // jobs: temp_jobs.reverse(),
		jobs,
    user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "JobHub - Listed Jobs"
	})
});

// const q = "UX"
// const tadese = jobs.filter(job => job.title.includes(q))
// console.log(...tadese)
// searching for a job
router.get('/search', (req, res) => {

  const result = jobs.filter(job => job.title.includes(req.query.q) )
  // console.log(req.query.q)
  res.render('search', {
    title: "Search Jobs - JobHub",
    jobs: result,
    user: req.isAuthenticated() ? { ...req.user._json } : null,
    queryData: req.query
  })
})

router.get("/:id", async (req, res) => {
  const jobId = req.params.id;
  // const [temp_jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC') 
  // const [temp_job] = await pool.execute('SELECT * FROM jobs WHERE id = ?', jobId) 

  const job = jobs.find((job) => job.id === jobId)
  // const job = temp_jobs.find(j => j.id == jobId);
  if (!job) {
    return res.status(404).render('404', { title: 'Job Not Found', user: req.isAuthenticated() ? { ...req.user._json } : null });
  }

  const similarJobs = jobs
	  .filter(j => j.id !== jobId && j.categories.some(cat => job.categories.includes(cat)))
	  .slice(0, 3);

  // res.render("job-details", {job, similarJobs, title: `${job.title} - JobHub` });
  res.render("test", { 
    job, 
    similarJobs, 
    user: req.isAuthenticated() ? { ...req.user._json } : null,
    title: `${job.title} - JobHub` });

});

// apply for a job
router.get("/:id/apply", checkLogin, async (req, res) => {
  // const [temp_jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC') 
  const job = jobs.find(job => job.id == req.params.id)

  res.render("apply", {
    job,
    jobs,
    user: req.isAuthenticated() ? { ...req.user._json } : null,
    title: `${job.title} - JobHub`,
  })
});


export default router