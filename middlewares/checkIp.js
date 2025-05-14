const checkIp = (req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (ip !== process.env.ALLOWED_IP) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

export default checkIp;
