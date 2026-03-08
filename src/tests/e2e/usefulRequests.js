const userUrl = "http://localhost:3000/api/users"
const aboutMeUrl = "http://localhost:3000/api/users/me"
const loginUrl = "http://localhost:3000/api/users/login"
const logoutUrl = "http://localhost:3000/api/users/logout"

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
    requestLogout
}