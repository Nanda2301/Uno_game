const express = require("express");
const routes = require("./routes/routes");
const errorMiddleware = require("./middlewares/errorMiddleware.js");
const cardRoutes = require("./routes/CardRoutes");

const app = express();

app.use(express.json());

app.use("/uno", routes);

app.use("/uno/games", routes); 
app.use("/uno/cards", cardRoutes);
app.use(errorMiddleware)

module.exports = app;