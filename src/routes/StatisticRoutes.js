const express = require("express")
const router = express.Router()

const statisticController = require("../controllers/StatisticController")

router.get("/requests", statisticController.requestStatistics)
router.get("/status-codes", statisticController.requestStatusStatistics)
router.get("/popular-endpoints", statisticController.mostPopularEndpoint)
router.get("/response-times", statisticController.ResponseTimeStatistics)

module.exports = router