const express = require("express");
const userController = require("../controllers/UserController.js");
const router = express.Router();

router.post("/create", userController.create);
router.get("/all", userController.findAll);
router.get("/:id", userController.getById);
router.delete("/:id", userController.delete);

module.exports = router;