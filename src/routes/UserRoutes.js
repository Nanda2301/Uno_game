const express = require("express");
const userController = require("../controllers/UserController.js");
const router = express.Router();

router.post("/create", (req, res, next) => userController.create(req, res, next));
router.get("/:id", (req, res, next) => userController.getById(req, res, next));
router.get("/get-all", (req, res, next) => userController.findAll(req, res, next));
router.delete("/:id", (req, res, next) => userController.delete(req, res, next));

module.exports = router;