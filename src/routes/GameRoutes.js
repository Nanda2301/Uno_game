const express = require("express");
const gameController = require("../controllers/GameController");
const router = express.Router();

router.post("/", gameController.create);
router.get("/", gameController.findAll);
router.get("/:id", gameController.getById);
router.put("/:id", gameController.update);
router.delete("/:id", gameController.delete);

module.exports = router;