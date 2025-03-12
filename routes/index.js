import express from 'express';
const router = express.Router();
import passport from "passport";
import { jobs } from '../db/jobs.js';
import saveReturnTo from '../middlewares/saveReturnTo.js'

const db = []
router.get('/', (req, res) => {
	console.log(req.user)
	res.render('index', {
		jobs,
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "JobHub - Find Your Dream Job",
	})
})

router.get('/home', (req, res) => {

	res.render('landing', {
		job: jobs[0],
    	jobs,
    	user: req.isAuthenticated() ? { ...req.user._json } : null,
    	title: "JobHub - Find Your Dream Job"
	})
})

router.get('/test', (req, res) => {
	res.render('test', {
		job: jobs[0],
    	jobs,
    	user: req.isAuthenticated() ? { ...req.user._json } : null,
    	title: "JobHub - Find Your Dream Job"
	})
})

router.get('/login', (req, res) => {
	res.render('login', {
		job: jobs[0],
    	jobs,
    	user: req.isAuthenticated() ? { ...req.user._json } : null,
    	title: "JobHub - Find Your Dream Job"
	})
})

router.get('/register', (req, res) => {
	res.render('register', {
		job: jobs[0],
    	jobs,
    	user: req.isAuthenticated() ? { ...req.user._json } : null,
    	title: "JobHub - Find Your Dream Job"
	})
})


router.post('/register', (req, res) => {

})

router.get('/auth/google', passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
  	db.push({ ...req.user._json, role: "user" })
  	req.session.db = db
  	res.redirect('/')
  } 
);
export default router