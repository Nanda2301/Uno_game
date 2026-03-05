const express = require("express");
const cardController = require("../controllers/CardController");
const authMiddleware = require("../middlewares/auth.middleware");
const router = express.Router();


router.post("/", authMiddleware, cardController.create);
router.get("/", authMiddleware, cardController.findAll);

router.get("/:id",authMiddleware, cardController.getById);
router.put("/:id", authMiddleware, cardController.update);
router.delete("/:id", authMiddleware, cardController.delete);

module.exports = router;