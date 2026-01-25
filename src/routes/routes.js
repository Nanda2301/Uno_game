const express = require("express");

const userRoutes = require("./UserRoutes.js");
const gameRoutes = require("./GameRoutes.js");
const cardRoutes = require("./CardRoutes.js");
const scoreRoutes = require("./ScoreRoutes.js"); 

const router = express.Router();

router.use("/users", userRoutes);
router.use("/games", gameRoutes);
router.use("/cards", cardRoutes);
router.use("/scores", scoreRoutes);

module.exports = router;