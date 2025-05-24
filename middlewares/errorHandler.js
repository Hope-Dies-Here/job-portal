// middlewares/errorHandler.js
export function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err.message || err);

  if (req.session) {
    req.session.error = err.message || 'Something went wrong.';
  }

  if (req.headers.referer) {
    return res.redirect('back');
  }

  res.status(500).render('error', {
    error: err.message || 'Internal Server Error',
  });
}
