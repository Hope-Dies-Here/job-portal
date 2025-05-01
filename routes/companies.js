import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.send('status')
})

router.get('/register', (req, res) => {
	res.render('companies/register', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Register for Companies - JobHub"
	})
})

router.get('/post-job', (req, res) => {
	res.render('companies/post-job', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Post Job - JobHub"
	})
})

router.get('/post', (req, res) => {
	res.render('companies/post-job-test', {
		user: req.isAuthenticated() ? req.user: null,
		title: "Jobs - JobHub"
	})
})
export default router
