const sequelize = require("../database")
const request = require("supertest")
const generateTestToken = require("./utils/token")
const app = require("../app")



describe("POST /games", ()=>{
    beforeAll(async ()=>{
        await sequelize.sync({force:true}) // Reinicia o banco de dados, criando todas a tabelas do zero
    })
    afterAll(async()=>{
        await sequelize.close() // Fecha conexão com banco de dados e libera memória
    })

    test("Create a game sucessifuly when the token is valid.", async ()=>{
        const testToken = generateTestToken()

        const response = await request(app)
        .post("/api/games")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
            title: "Jogo legal",
            status: "Active",
            maxPlayers: 3
        });

        expect(response.status).toBe(201); // API retorna que o recurso 
                                          // foi criado de maneira bem sucedida
    })


    test("Don't should create a game when the token is invalid.", async ()=>{
        const testToken = "TokenInválido"

        const response = await request(app)
        .post("/api/games")
        .set("Authorization", `Bearer ${testToken}`)
        .send({
            title: "Jogo legal",
            status: "Active",
            maxPlayers: 3
        });

        expect(response.status).toBe(401); // API retorna que o recurso 
                                          // foi criado de maneira bem sucedida
    })
})