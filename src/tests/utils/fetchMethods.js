const Result = require("../../config/result")

async function get(url, body={}, token="") {
    try{
        const response = await fetch(url, {
            body: JSON.stringify(body),
            method: "GET",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        if(!response.ok){
            return Result.fail(`Código do erro: ${response.status}`, response.status)
        }

        const requestResult = {body: await response.json(), status: response.status}
        return Result.ok(requestResult)
    }catch(err){
        return Result.fail(err)
    }
}

async function post(url, body={}, token="") {
    try{
        const response = await fetch(url, {
            method: "POST",
            headers:{
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)  
        })
            if(!response.ok){
                return Result.fail(`Código do erro: ${response.status}`, response.status)
            }
            const requestResult = {body: await response.json(), status: response.status}
            return Result.ok(requestResult)
    }catch(err){
        return Result.fail(err)
    }
}


module.exports = {get, post}