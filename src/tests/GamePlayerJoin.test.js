const request = require("supertest")
const generateTestToken = require("./utils/token")
const sequelize = require("../database")
const app = require("../app")


describe("/POST api/games/:gameId/join", ()=>{
    beforeAll(async ()=>{
        await sequelize.sync({force:true}) // Reinicia o banco de dados, criando 
                                          // todas a tabelas do zero
    })
    afterAll(async()=>{
        await sequelize.close() // Fecha conexão com banco de dados e libera memória
    })

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

    test("The user with a valid token can join in a existing game", async()=>{
        const resultGameCreated = await createGame()
        expect(resultGameCreated.status).toBe(201);

        //Join into a game
        const path = `/api/games/${resultGameCreated._body.id }/join`
        const secondPlayerToken = generateTestToken(2, "test2@gmail.com")
        const joinResponse = await request(app)
        .post(path)
        .set("Authorization", `Bearer ${secondPlayerToken}`);
        expect(joinResponse.status).toBe(201);

    })

    test("The user with an invalid token cannot join in a existing game", async()=>{
        const resultGameCreated = await createGame()
        expect(resultGameCreated.status).toBe(201);

        //Join into a game
        const path = `/api/games/${resultGameCreated._body.id }/join`
        const secondPlayerToken = "InvalidToken"
        const joinResponse = await request(app)
        .post(path)
        .set("Authorization", `Bearer ${secondPlayerToken}`);
        expect(joinResponse.status).toBe(401);

    })
})