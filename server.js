const express = require("express");
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

app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use("/packages", packageRoutes);
app.use("/bookings", bookings);

app.listen(port, () => {
  console.log(`Server started on port ${port}`.green.underline);
});
