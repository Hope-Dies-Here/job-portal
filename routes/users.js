import express from 'express';
import checkLogin from '../middlewares/checkLogin.js';

const router = express.Router();

router.get('/profile', checkLogin, (req, res) => {
	res.render('profile', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Profile - JobHub"
	});
})

router.get('/saved-jobs', (req, res) => {
	res.render('saved-jobs', {
		user: req.isAuthenticated() ? { ...req.user._json } : null,
		title: "Saved Jobs - JobHub"
	})
})
export default router;