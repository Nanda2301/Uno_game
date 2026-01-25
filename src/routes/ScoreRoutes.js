const express = require("express");
const scoreController = require("../controllers/ScoreController");
const router = express.Router();

router.post("/", scoreController.create);
router.get("/", scoreController.findAll);
router.get("/:id", scoreController.getById);
router.put("/:id", scoreController.update);
router.delete("/:id", scoreController.delete);

module.exports = router;