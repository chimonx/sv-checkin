const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// Enable CORS for requests coming from https://co-working.smobu.cloud
// For local testing, consider setting origin to "*" temporarily
app.use(cors({
  origin: "https://co-working.smobu.cloud", // Change to "*" for local testing if needed
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/bu_login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Call the BU API with the provided username and password
    const response = await axios.get(
      `https://assessment.bu.ac.th/App_AJAX/Login/CheckLogin.aspx?Username=${username}&Password=${password}`
    );

    // Log the raw response from the BU API for debugging
    console.log("Response from BU API:", response.data);

    const rawData = response.data;

    // Check if the response is a string that exactly equals "facultyOK" (after trimming any whitespace)
    if (typeof rawData === "string" && rawData.trim() === "facultyOK") {
      return res.json({ success: true });
    }

    // Alternatively, if the response is an object with a facultyOK property
    if (rawData && rawData.facultyOK) {
      return res.json({ success: true });
    }

    // If neither condition is met, send unauthorized
    res.status(401).json({ success: false, message: "Unauthorized" });
  } catch (error) {
    // Log the error details for debugging
    console.error("Error connecting to BU API:", error);
    res.status(500).json({ success: false, message: "Error connecting to API" });
  }
});

// Start the server on port 5000
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
