// 🚨 PRESTA ATENÇÃO AQUI CRIATURA 🚨
//  Para que esses testes funcionem é preciso que o servidor esteja rodando
//  então lembra de dar o "npm run dev" ai

const {requestCreateUser, requestToken, requestAboutMe, requestDeleteUser, requestLogout} = require("./usefulRequests")

const USER_1_DATA = {
    userName: "USER COUNT TEST 0001",
    name: "USER TEST 1",
    email: "USERTEST1@gmail.com",
    password: "test123"      
}

const USER_2_DATA = {
    userName: "USER COUNT TEST 0002",
    name: "USER TEST 2",
    email: "USERTEST2@gmail.com",
    password: "test123"
}

describe("Criação dos usuários", ()=>{

    it("Criação do usuário 1", async ()=>{
        const response = await requestCreateUser(USER_1_DATA)
        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)
    })
    
    it("Criação do usuário 2", async ()=>{
        const response = await requestCreateUser(USER_2_DATA)
        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)
    })
})


let tokenUser1;
let tokenUser2;
let user1Id;
let user2Id;

describe("Login do usuário", ()=>{    
    beforeAll(async () =>{
        const credenciais_usuario_1 = {
            email: USER_1_DATA.email,
            password: USER_1_DATA.password      
        }
        const credenciais_usuario_2 = {
            email: USER_2_DATA.email,
            password: USER_2_DATA.password
        }

        const responseToken1 = await requestToken(credenciais_usuario_1)
        expect(responseToken1.ok).toBe(true)
        tokenUser1 = (await responseToken1.json()).token

        const responseToken2 = await requestToken(credenciais_usuario_2)
        expect(responseToken2.ok).toBe(true)
        tokenUser2 = (await responseToken2.json()).token
    })

    it("Login do usuário 1 deve retornar 200", async()=>{
        expect(tokenUser1).toBeDefined();
    })

    it("Login do usuário 2 deve retornar 200", async()=>{
        expect(tokenUser2).toBeDefined();
    })

    it("About-me do usuário 1", async()=>{
        const responseAboutMe = await requestAboutMe(tokenUser1)
        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)

        const bodyResult = await responseAboutMe.json()
        user1Id = bodyResult.id
    })

    it("About-me do usuário 2", async()=>{
        const responseAboutMe = await requestAboutMe(tokenUser2)
        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)

        const body = await responseAboutMe.json()
        user2Id = body.id
    })
})

describe("Clear data user", ()=>{
    it("Delete user 1 data", async ()=>{
        expect(user1Id).toBeDefined();
        expect(tokenUser1).toBeDefined()

        const response = await requestDeleteUser(user1Id, tokenUser1)
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200)
    })

    it("Delete user 2 data", async ()=>{
        expect(user2Id).toBeDefined();
        expect(tokenUser2).toBeDefined()

        const response = await requestDeleteUser(user2Id, tokenUser2)
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200)
    })
})

describe("Logout do usuário", ()=>{

    it("Usuário 1 fez logout com sucesso!", async()=>{
        expect(tokenUser1).toBeDefined()
        const result = await requestLogout(tokenUser1);
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
    })

    it("Usuário 2 fez logout com sucesso!", async()=>{
        expect(tokenUser2).toBeDefined()
        const result = await requestLogout(tokenUser2);
        expect(result.ok).toBe(true)
        expect(result.status).toBe(200)
    })
})
