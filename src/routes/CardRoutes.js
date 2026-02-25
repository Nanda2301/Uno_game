const express = require("express");
const cardController = require("../controllers/CardController");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/deal", cardController.deal);
router.post("/", cardController.create);
router.get("/", cardController.findAll);

router.get("/my-cards", authMiddleware, cardController.getMyCards);

router.get("/:id", cardController.getById);
router.put("/:id", authMiddleware, cardController.update);
router.delete("/:id", authMiddleware, cardController.delete);

module.exports = router;