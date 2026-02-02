const express = require("express");
const userController = require("../controllers/UserController.js");
const authMiddleware = require("../middlewares/auth.middleware.js")
const router = express.Router();
const AuthController = require("../controllers/AuthController.js")

router.post("/", userController.create);
router.get("/",  userController.findAll);
router.get("/me", authMiddleware, userController.aboutMe)
router.get("/:id", userController.getById);
router.put('/:id', userController.update);
router.delete("/:id", authMiddleware, userController.delete);
router.post("/login", userController.login)
router.post("/logout", authMiddleware, AuthController.logout);

module.exports = router;