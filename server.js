const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const colors = require("colors");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookings = require("./routes/bookingRoutes");

const port = process.env.PORT || 5000;

connectDB();
const app = express();
app.use(cors());

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(bodyParser.urlencoded({ extended: true }));
app.use("/users", userRoutes);
app.use("/admins", adminRoutes);
app.use("/packages", packageRoutes);
app.use("/bookings", bookings);
app.use('/data', express.static('data'));

app.use("/admin", express.static(path.join(__dirname, "./builds/admin")));
app.get("/admin/*", (req, res) => {
  
  res.sendFile(path.resolve(__dirname, "builds/admin/index.html"));
});

app.use("/", express.static(path.join(__dirname, "builds/frontend")));
app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "builds/frontend/index.html"));
});






app.listen(port, () => {
  console.log(`Server started on port ${port}`.green.underline);
});
