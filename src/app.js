const express = require("express");
const routes = require("./routes/routes"); // Roteador principal
const errorMiddleware = require("./middlewares/errorMiddleware.js");

const app = express();

app.use(express.json());

app.use("/uno", routes); 

app.use(errorMiddleware);

module.exports = app;