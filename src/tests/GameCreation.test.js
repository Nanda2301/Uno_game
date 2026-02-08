const sequelize = require("../database")
const {request} = require("supertest")



describe("POST /game", ()=>{
    beforeAll(async ()=>{
        await sequelize.sync({force:true}) // Reinicia o banco de dados, criando todas a tabelas do zero
    })
    afterAll(async()=>{
        await sequelize.close() // Fecha conexão com banco de dados e libera memória
    })

    test("Create a game sucessifuly when the token is valid.", ()=>{

    })
})