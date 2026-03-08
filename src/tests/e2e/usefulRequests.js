const userUrl = "http://localhost:3000/api/users"
const aboutMeUrl = "http://localhost:3000/api/users/me"
const loginUrl = "http://localhost:3000/api/users/login"
const logoutUrl = "http://localhost:3000/api/users/logout"
const createGameURL = "http://localhost:3000/api/games"

const requestDeleteGame= async (gameId, userToken)=>{
    const deleteGameURL = `${createGameURL}/${gameId}`
    return await fetch(deleteGameURL, {
         method: "DELETE",
         headers:{ "Authorization": `Bearer ${userToken}` }
    })
}

const requestIniciarPartida = async(gameId, userToken)=>{
    const startGameURL = `http://localhost:3000/api/games/${gameId}/start`

    return await fetch(startGameURL, {
         method: "POST",
         headers:{ "Authorization": `Bearer ${userToken}` }
    })
}

const requestJoinGame = async(userToken, gameId) => {
    const joinGameURL = `http://localhost:3000/api/games/${gameId}/join`

    return await fetch(joinGameURL, {
         method: "POST",
         headers:{ "Authorization": `Bearer ${userToken}` }
    })
} 

const requestReadyInGame = async (userToken, gameId) => {
    const markReadyURL = `http://localhost:3000/api/games/${gameId}/ready`

    return await fetch(markReadyURL, {
        method: "POST",
        headers:{ "Authorization": `Bearer ${userToken}` }
    })
}

const requestCreateGame = async(userToken, configGameBody) => {
    return await fetch(createGameURL, {
        method: "POST",
        headers:{
            "Content-type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify(configGameBody)
    })
}

const requestCreateUser = async(userData) =>{
    return await fetch(userUrl, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(userData)
    })
}

const requestToken = async(credenciais) => {
    return await fetch(loginUrl, {
        method: "POST",
        headers:{ "Content-type": "application/json" },
        body: JSON.stringify(credenciais)
    })
}

const requestAboutMe = async(userToken) => {
    return await fetch(aboutMeUrl, {
        method: "GET",
        headers:{ "Authorization": `Bearer ${userToken}`}
    })
}

const requestDeleteUser = async(userId, token)=>{
    const endpointDelete = `${userUrl}/${userId}`
    return await fetch(endpointDelete, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

const requestLogout = async(token) => {
    return await fetch(logoutUrl, {
        method: "POST",
        headers:{ "Authorization": `Bearer ${token}` }
    })
}

module.exports = {
    requestCreateUser,
    requestToken,
    requestAboutMe,
    requestDeleteUser,
    requestLogout,
    requestCreateGame,
    requestJoinGame,
    requestReadyInGame,
    requestIniciarPartida,
    requestDeleteGame
}