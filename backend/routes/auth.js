const express = require("express");
const router = express.Router();
const db = require("../db/db");

// ✅ Dummy login route
router.post("/dummy-login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    return res.json({ message: "Dummy login successful", token: "fake-jwt-token" });
  } else {
    return res.status(401).json({ message: "Invalid dummy credentials" });
  }
});

// ✅ Real login route (with MySQL)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND status = 'active'",
      [username]
    );

    if (rows.length > 0 && password === "password") {
      return res.json({
        message: "Login successful",
        token: "fake-jwt-token",
        user: {
          id: rows[0].id,
          name: rows[0].name,
          role: rows[0].role,
        },
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
