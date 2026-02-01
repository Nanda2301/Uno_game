const express = require("express");
const scoreController = require("../controllers/ScoreController");
const router = express.Router();

// Rotas básicas CRUD
router.post("/", scoreController.create);
router.get("/", scoreController.findAll);
router.get("/:id", scoreController.getById);
router.put("/:id", scoreController.update);
router.delete("/:id", scoreController.delete);

// Novas rotas de ranking e estatísticas
router.get("/ranking/geral", scoreController.obterRanking);              // Ranking completo
router.get("/ranking/top10", scoreController.obterTop10);                // Top 10
router.get("/player/:playerId/stats", scoreController.obterEstatisticasJogador); // Stats de jogador

module.exports = router;