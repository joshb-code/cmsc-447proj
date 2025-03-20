const express = require("express");
const router = express.Router();

// Dummy login route
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Dummy authentication check
    if (username === "admin" && password === "password") {
        return res.json({ message: "Login successful", token: "fake-jwt-token" });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

module.exports = router;
