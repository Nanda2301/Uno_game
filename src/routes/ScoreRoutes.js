const express = require("express");
const scoreController = require("../controllers/ScoreController");
const createMemoizationMiddleware = require("../middlewares/memoizationMiddleware");
const router = express.Router();

const cacheConfig = {
    max: 50,         // Número máximo de itens no cache
    maxAge: 30000    // Expiração em 30 segundos
};

const cacheMiddleware = createMemoizationMiddleware(cacheConfig);

router.get("/", scoreController.findAll);
router.get("/:id", scoreController.getById);
router.delete("/:id", scoreController.delete);

router.get("/ranking/geral", cacheMiddleware, scoreController.obterRanking);              
router.get("/ranking/top10", cacheMiddleware, scoreController.obterTop10);                
router.get("/player/:playerId/stats", cacheMiddleware, scoreController.obterEstatisticasJogador); 

module.exports = router;