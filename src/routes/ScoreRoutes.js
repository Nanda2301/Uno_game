const express = require("express");
const scoreController = require("../controllers/ScoreController");
const createMemoizationMiddleware = require("../middlewares/memoizationMiddleware");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

const cacheMiddleware = createMemoizationMiddleware({
  max: 50,
  maxAge: 30000
});

router.get("/", scoreController.findAll);
router.get("/ranking/geral", cacheMiddleware, scoreController.obterRanking);
router.get("/ranking/top10", cacheMiddleware, scoreController.obterTop10);
router.get("/player/:playerId/stats", authMiddleware, cacheMiddleware, scoreController.obterEstatisticasJogador);
router.get("/:id", scoreController.getById);
router.put("/:id", authMiddleware, scoreController.update);
router.delete("/:id", authMiddleware, scoreController.delete);

module.exports = router;