const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

dotenv.config();

const authRoute = require("./routes/authRoute");
const userRoutes = require("./routes/userRoutes");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const tryonRoute = require("./routes/tryonRoute");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "https://trendies-frontend-b7wv.onrender.com",
      "https://trendies-admin-o01i.onrender.com",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/tryon", tryonRoute);

app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

