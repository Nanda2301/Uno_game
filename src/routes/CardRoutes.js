const express = require("express");
const cardController = require("../controllers/CardController");
const router = express.Router();

router.post("/", cardController.create);
router.get("/", cardController.findAll);
router.get("/:id", cardController.getById);
router.put("/:id", cardController.update);
router.delete("/:id", cardController.delete);

module.exports = router;