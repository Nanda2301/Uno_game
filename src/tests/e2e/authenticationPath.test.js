const userUrl = "http://localhost:3000/api/users"
const aboutMeUrl = "http://localhost:3000/api/users/me"

describe("Criação dos usuários", ()=>{

    it("Criação do usuário 1", async ()=>{
        const user1 = {
            userName: "Miquéias Ferreira Dos Santos",
            name: "MiqueiasF",
            email: "miqueias@gmail.com",
            password: "miqueias123"      
        }
        const response = await fetch(userUrl, {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(user1)
        })
        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)
    })
    
    it("Criação do usuário 2", async ()=>{
        const user2 = {
            "userName": "Lara Matos Aguirres",
            "name": "Lara",
            "email": "lara@gmail.com",
            "password": "lara123"
        }
        const response = await fetch(userUrl, {
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body: JSON.stringify(user2)
        })

        expect(response.ok).toBe(true)
        expect(response.status).toBe(201)
    })
})

let tokenUser1;
let tokenUser2;
describe("Autenticação do usuário", ()=>{    
    beforeAll(async ()=>{
        const loginUrl = "http://localhost:3000/api/users/login"

        const credenciais_usuario_1 = {
            email: "miqueias@gmail.com",
            password: "miqueias123"      
        }
        const credenciais_usuario_2 = {
            "email": "lara@gmail.com",
            "password": "lara123"
        }

        const responseToken1 = await fetch(loginUrl, {
            method: "POST",
            headers:{ "Content-type": "application/json" },
            body: JSON.stringify(credenciais_usuario_1)
        })
        const responseToken2 = await fetch(loginUrl, {
            method: "POST",
            headers:{ "Content-type": "application/json" },
            body: JSON.stringify(credenciais_usuario_2)
        })

        expect(responseToken1.ok).toBe(true)
        expect(responseToken2.ok).toBe(true)

        tokenUser1 = (await responseToken1.json()).token
        tokenUser2 = (await responseToken2.json()).token
    })

    it("Login do usuário 1 deve retornar 200", async()=>{
        expect(tokenUser1).toBeDefined();
    })

    it("Login do usuário 2 deve retornar 200", async()=>{
        expect(tokenUser2).toBeDefined();
    })

    it("About-me do usuário 1", async()=>{
        const responseAboutMe = await fetch(aboutMeUrl, {
            method: "GET",
            headers:{
                "Authorization": `Bearer ${tokenUser1}`
            }
        })

        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)
    })

    it("About-me do usuário 2", async()=>{
        const responseAboutMe = await fetch(aboutMeUrl, {
            method: "GET",
            headers:{
                "Authorization": `Bearer ${tokenUser2}`
            }
        })

        expect(responseAboutMe.ok).toBe(true)
        expect(responseAboutMe.status).toBe(200)
    })
})