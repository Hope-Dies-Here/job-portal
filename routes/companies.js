import express from 'express';
import { jobs } from "../db/jobs.js";
import Company from '../models/Company.js';
import { Category, Job } from '../models/Job.js';
import checkAdmin from '../middlewares/checkAdmin.js';
const router = express.Router();

router.get('/', (req, res) => {
	res.render('companies/index', {
		user: req.isAuthenticated() ? req.user : null,
		title: "Companies - JobHub"
	})
})

router.get('/register', (req, res) => {
	
	res.render('companies/register', {
		user: req.isAuthenticated() ? user : null,
		title: "Register for Companies - JobHub"
	})
});

router.post('/register', async (req, res) => {
	try {
		
		const body = req.body;
	
		console.log(body);
		const data = await Company.create(req.body);
		if (!data) {
			res.status(400).json({ success: false, message: "Error creating company" });
		}
	
		const companies = await Company.findAll();
	
		req.flash("success", "Company created");
		res.status(201).json({ success: true, companies, message: "Company created" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ success: false, message: error.message });		
	}


	

})


router.get('/manage-jobs', (req, res) => {

	res.render('companies/manage-jobs', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Post Job - JobHub"
	})
})

router.get('/:company/jobs', (req, res) => {

	res.render('companies/manage-jobs', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Post Job - JobHub"
	})
})

router.get('/manage-jobs/:id/applicants', (req, res) => {

	res.render('companies/applicants', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Post Job - JobHub"
	})
})

router.get("/:company/jobs/:job/applicants", async (req, res) => {
	// const [temp_jobs] = await pool.execute('SELECT * FROM jobs ORDER BY id ASC')
	const job = jobs.find((job) => job.id == req.params.job);
  
	res.render("companies/applicants", {
	  job,
	  jobs,
	  user: req.isAuthenticated() ? req.user : null,
	  title: `${job.title} - JobHub`,
	});
  });

router.get("/:company/jobs/:job/edit", async (req, res) => {
	const job = await Job.findById(req.params.job);

	if(!job) {
		res.json({ error: "beyu mnshe" })
		return
	}
	const categories = await Category.findAll();
	const company = await Company.findById(req.params.company);
	if(!company) {
		res.render('404', {
			user: req.isAuthenticated() ? req.user: null,
			title: "Not Found - Jobhub"
		})
		return
	}
	console.log(company);
	res.render("companies/update-job", {
		user: req.isAuthenticated() ? req.user: null,
		company,
		categories,
		job,
		title: "Edit Job - JobHub"
	})
})


router.get('/post-job', checkAdmin, async (req, res) => {
	const companies = await Company.findAll();
	const categories = await Category.findAll();
	res.render('companies/post-job-test', {
		user: req.isAuthenticated() ? req.user: null,
		companies,
		categories,
		title: "Jobs - JobHub"
	})
})
export default router
