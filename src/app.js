const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const cellRoutes = require("./routes/cells");
app.use(cellRoutes);

const PORT = process.env.API_PORT || 8080;

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});