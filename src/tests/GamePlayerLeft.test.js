const request = require("supertest")
const generateTestToken = require("./utils/token")
const sequelize = require("../database")
const app = require("../app")


createGame = async()=>{
    const testToken = generateTestToken()

    const response = await request(app)
    .post("/api/games")
    .set("Authorization", `Bearer ${testToken}`)
    .send({
        title: "Jogo legal",
        status: "Active",
        maxPlayers: 3
    }); 

    return response
}

describe("/POST api/games/:gameId/ready", ()=>{
    beforeAll(async ()=>{
        await sequelize.sync({force:true}) // Reinicia o banco de dados, criando 
                                          // todas a tabelas do zero
    })
    afterAll(async()=>{
        await sequelize.close() // Fecha conexão com banco de dados e libera memória
    })

    test("User that joined on game can change status to 'ready'", async()=>{
        const resultGameCreated = await createGame()
        expect(resultGameCreated.status).toBe(201);

        // Join into a game
        const path = `/api/games/${resultGameCreated._body.id }/join`
        const secondPlayerToken = generateTestToken(2, "test2@gmail.com")
        const joinResponse = await request(app)
        .post(path)
        .set("Authorization", `Bearer ${secondPlayerToken}`);
        
        // Faz com que o jogador fique pronto para começar a partida
        const readyPath = `/api/games/${resultGameCreated._body.id }/ready`
        const readyResponse = await request(app)
        .post(readyPath)
        .set("Authorization", `Bearer ${secondPlayerToken}`);

        expect(readyResponse.status).toBe(200)
    })
})