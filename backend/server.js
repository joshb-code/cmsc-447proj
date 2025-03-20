const express = require("express");
const app = express();

// Middleware to parse JSON
app.use(express.json());

//import and user routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Simple test route
app.get("/", (req, res) => {
    res.send("Express server is running!");
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
