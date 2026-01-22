//Orquestrador geral de rotas
const express = require("express");

const userRoutes = require("./UserRoutes.js");
const gameRoutes = require("./GameRoutes.js");
const cardRoutes = require("./CardRoutes.js");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/cards", cardRoutes);

module.exports = router;