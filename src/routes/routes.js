//Orquestrador geral de rotas
const express = require("express");

const userRoutes = require("./UserRoutes.js");

const router = express.Router();

router.use("/users", userRoutes);

module.exports = router;