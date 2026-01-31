const express = require("express");
const userController = require("../controllers/UserController.js");
const AuthController = require("../controllers/AuthController");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.post("/", userController.create);
router.get("/", userController.findAll);
router.get("/:id", userController.getById);
router.delete("/:id", userController.delete);
router.post("/login", userController.login)
router.post("/logout", authMiddleware, AuthController.logout);

module.exports = router;