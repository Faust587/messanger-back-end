const express = require("express");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const cookieParser = require("cookie-parser")

require("dotenv").config();
require("./database/connector").connect();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}));
app.use(cookieParser());
app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
