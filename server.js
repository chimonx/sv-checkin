const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// อนุญาตเฉพาะ origin จาก https://co-working.smobu.cloud
app.use(cors({
  origin: "https://co-working.smobu.cloud",  // Allow requests from this origin
  methods: ["POST"],  // Allow only POST requests
  allowedHeaders: ["Content-Type"]  // Allow only Content-Type header
}));

app.use(express.json());

app.post("/bu_login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Call the BU API with username and password
    const response = await axios.get(
      `https://assessment.bu.ac.th/App_AJAX/Login/CheckLogin.aspx?Username=${username}&Password=${password}`
    );
    
    console.log("Response from BU API:", response.data); // Log the response for debugging

    // Check if login was successful
    if (response.data.facultyOK) {
      // Send success response if facultyOK is true
      res.json({ success: true });
    } else {
      // Send failure response if facultyOK is false
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    // Log the error for debugging
    console.error("Error connecting to BU API:", error);
    
    // Send server error response
    res.status(500).json({ success: false, message: "Error connecting to API" });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
