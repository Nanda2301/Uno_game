const express = require("express");
const cors = require("cors");
require("./models/Assossietions.js");

const routes = require("./routes/routes");
const errorMiddleware = require("./middlewares/errorMiddleware.js");
const APITracker = require("./middlewares/APITracker.js");

const app = express();

// CORS configurado para o Vite
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Middleware de rastreamento
app.use(APITracker);

// Rotas
app.use("/api", routes);

// Middleware de erro (sempre por último)
app.use(errorMiddleware);

module.exports = app;