const ApiUsageLogService = require("../services/APIUsageLogService")

class StatisticController{
    async requestStatistics(req, res, next){
        const result = await ApiUsageLogService.countRequest()

        if(result.ok){
            return res.status(result.status).json(result.value)
        }
        next(result.error)
    }

    async requestStatusStatistics(req, res, next){
        const result = await ApiUsageLogService.countStatusCode()

        if(result.ok){
            return res.status(result.status).json(result.value)
        }
        next(result.error)
    }

    async mostPopularEndpoint(req, res, next){
        const result = await ApiUsageLogService.mostPopularEndpoint()

        if(result.ok){
            return res.status(result.status).json(result.value)
        }
        next(result.error)
    }

    async ResponseTimeStatistics(req, res, next){
        const result = await ApiUsageLogService.requestResponseTime()

        if(result.ok){
            return res.status(result.status).json(result.value)
        }
        next(result.error)
    }
}

module.exports = new StatisticController()