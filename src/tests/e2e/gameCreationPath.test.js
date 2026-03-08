// 🚨 PRESTA ATENÇÃO AQUI CRIATURA 🚨
//  Para que esses testes funcionem é preciso que o servidor esteja rodando
//  então lembra de dar o "npm run dev" ai

const {requestCreateUser, requestToken, requestAboutMe, requestDeleteUser, requestCreateGame, requestJoinGame, requestReadyInGame, requestIniciarPartida, requestDeleteGame} = require("./usefulRequests")

const USER_1_DATA = {
    userName: "USER 1 GAME CREATION TEST",
    name: "USER 1 GAME CREATION TEST",
    email: "UserGameTest1@gmail.com",
    password: "test123"      
}

const USER_2_DATA = {
    userName: "USER 2 GAME CREATION TEST",
    name: "USER 2 GAME CREATION TEST",
    email: "UserGameTest2@gmail.com",
    password: "test123"
}

const gameInitialConfig = {
    title: "Jogo do usuário 1",
    maxPlayers: 2
}

let token1;
let token2;
let id1;
let id2;

describe("Inicialização dos jogadores", ()=>{
    it("Inicialização do jogador 1", async()=>{
        const response = await requestCreateUser(USER_1_DATA)
        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)

        const responseToken1 = await requestToken({
            email: USER_1_DATA.email,
            password: USER_1_DATA.password      
        })
        expect(responseToken1.ok).toBe(true)
        token1 = (await responseToken1.json()).token

        const responseAboutMe = await requestAboutMe(token1)
        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)
        id1 = (await responseAboutMe.json()).id
    })

    it("Inicialização do jogador 2", async()=>{
        const response = await requestCreateUser(USER_2_DATA)
        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)

        const responseToken2 = await requestToken({
            email: USER_2_DATA.email,
            password: USER_2_DATA.password      
        })
        expect(responseToken2.ok).toBe(true)
        token2 = (await responseToken2.json()).token

        const responseAboutMe = await requestAboutMe(token2)
        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)
        id2 = (await responseAboutMe.json()).id
    })
})

let gameId;
describe("Criação da partida", ()=>{

    it("Usuário 1 cria a partida", async ()=>{
        expect(token1).toBeDefined()
        
        const responseGameCreation = await requestCreateGame(token1, gameInitialConfig)
        expect(responseGameCreation.ok).toBe(true)
        expect(responseGameCreation.status).toBe(201)

        const responseBody = await responseGameCreation.json()
        gameId = responseBody.id
    })
})

describe("Jogadores entram na partida e se preparam", ()=>{

    it("Usuário 2 deve conseguir entrar no jogo do usuário 1 e ficar marcado como pronto", async ()=>{
        expect(token2).toBeDefined()
        expect(gameId).toBeDefined()

        const joinGameResponse = await requestJoinGame(token2, gameId);
        expect(joinGameResponse.ok).toBe(true)
        expect(joinGameResponse.status).toBe(200)

        const markReadyResponse = await requestReadyInGame(token2, gameId);
        expect(markReadyResponse.ok).toBe(true)
        expect(markReadyResponse.status).toBe(200)

    })
})

describe("Inicialização do jogo", ()=>{
    it("Usuário 1 deve conseguir iniciar a partida", async()=>{
        expect(gameId).toBeDefined()
        expect(token1).toBeDefined()

        const inciarPartidaResponse = await requestIniciarPartida(gameId, token1)
        expect(inciarPartidaResponse.ok).toBe(true)
        expect(inciarPartidaResponse.status).toBe(200)
    })
})


describe("Delete data", ()=>{
    it("Deve deletar o jogo criado pelo usuário 1", async()=>{
        expect(token1).toBeDefined()
        expect(gameId).toBeDefined()

        const deleteGameResponse = await requestDeleteGame(gameId, token1);
        expect(deleteGameResponse.ok).toBe(true);
        expect(deleteGameResponse.status).toBe(200)
    })

    it("Delete user 1 data", async ()=>{
        expect(id1).toBeDefined();
        expect(token1).toBeDefined()

        const response = await requestDeleteUser(id1, token1)
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200)
    })

    it("Delete user 2 data", async ()=>{
        expect(id2).toBeDefined();
        expect(token2).toBeDefined()

        const response = await requestDeleteUser(id2, token2)
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200)
    })
})
