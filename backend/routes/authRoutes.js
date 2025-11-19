const router = require("express").Router();
const jwt = require("jsonwebtoken");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/check-auth", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ message: "ok", user: decoded });

  } catch {
    res.status(401).json({ message: "Invalid" });
  }
});

module.exports = router;