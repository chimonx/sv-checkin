const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// อนุญาตเฉพาะ origin จาก https://co-working.smobu.cloud
app.use(cors({
  origin: "https://co-working.smobu.cloud",
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const response = await axios.get(
      `https://assessment.bu.ac.th/App_AJAX/Login/CheckLogin.aspx?Username=${username}&Password=${password}`
    );

    if (response.data.facultyOK) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error connecting to API" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
