require("dotenv/config");
const express = require("express");

const mainRoute = require("./src/route/main.route");
const googleAuthRoute = require("./src/route/google.auth.route");

const port = process.env.PORT || 4000;

const app = express();

app.use(express.json());

app.use("/", mainRoute);
app.use("/auth", googleAuthRoute);

app.listen(port, () => {
  console.log("Server running in port " + port);
});
