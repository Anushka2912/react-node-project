const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//Import Routes
const submissionsRoute = require('./routes/submissions');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

// Use routes
app.use('/submissions', submissionsRoute);

// Routes
app.get("/", (req, res) => res.send("API is running"));

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));