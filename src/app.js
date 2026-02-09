const express = require("express");
require("./models/Assossietions.js")
const routes = require("./routes/routes");
const errorMiddleware = require("./middlewares/errorMiddleware.js");

const app = express();

app.use(express.json());
app.use("/api", routes);
app.use(errorMiddleware);

module.exports = app;
