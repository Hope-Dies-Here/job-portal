const saveReturnTo = (req, res, next) => {



	if(req.query.returnTo && req.query.returnTo.startsWith('/')) {
		req.session.returnTo = req.query.returnTo
	}

	next()
}

export default saveReturnTo