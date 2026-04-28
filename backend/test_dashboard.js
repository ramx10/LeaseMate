const jwt = require("jsonwebtoken");
const axios = require("axios");

const SECRET = "leasemate_secret";

const token = jwt.sign({ id: 14, role: "Owner" }, SECRET, { expiresIn: "1h" });

async function testDashboard() {
  try {
    const res = await axios.get("http://localhost:5000/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Dashboard response:", JSON.stringify(res.data, null, 2));

    const props = await axios.get("http://localhost:5000/api/properties", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Properties response length:", props.data.length);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testDashboard();
