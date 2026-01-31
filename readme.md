# UNO project

A REST API built with Node.js, Express, and Sequelize, using SQLite as the database. This project provides basic user management endpoints and follows common backend best practices.

## Technologies & Packages
The project uses the following main dependencies:

- **express** – Web framework for building APIs

- **sequelize** – ORM for database management

- **sqlite3** – Lightweight relational database

- **bcrypt** – Password hashing

- **jsonwebtoken** – Acess token

## Getting started 
### Prerequisites
Make sure you have the following installed:
- Node.Js
- npm

### Installation
Install the project dependencies with `npm ci`

### Running the project
Start the development server with `npm run dev`

# Manual da API - Endpoints CRUD

Abaixo estão listados todos os endpoints disponíveis para manipular Usuários, Jogos, Cartas e Pontuações.

**Base URL:** `http://localhost:3000/api`

---

## User
Gerenciamento de jogadores e autenticação.

### 1. Create User 
* **Method:** `POST`
* **URL:** `/users`
* **Body (JSON):**
```json
{
  "name": "Murillo Morais",
  "userName": "murillomorais99",
  "email": "murillo@email.com",
  "password": "senhaSegura123"
}
```

### 2. Authentication
* **Method:** `POST`
* **URL:** `/users/login`
* **Body (JSON):**
```json
{
  "email": "murillo@email.com",
  "password": "senhaSegura123"
}
```
### 3. List All Users
* **Method:** `GET`
* **URL:** `/users/login`

### 4. Get User by ID
* **Method:** `GET`
* **URL:** `/users/:id`

### 5. Delete User
* **Method:** `DELETE`
* **URL:** `/users/:id`

## Criar Card
* **Method:** `POST`
* **URL:** `/cards`
* **Body (JSON):**
```json
{
  "color": "red",
  "value": "7",
  "gameId": 1
}
```
### 2. List All Cards
* **Method:** `GET`
* **URL:** `/cards`
* 
### 3. Get Card by ID
* **Method:** `GET`
* **URL:** `/cards/:id`
* 
### 4. Update Card
* **Method:** `PUT`
* **URL:** `/cards/:id`
```json
{
  "value": "8",
  "color": "blue"
}
```
### 5. Delete Game
* **Method:** `DELETE`
* **URL:** `/cards/:id`
* 

## Create Game
* **Method:** `POST`
* **URL:** `/games`
* **Body (JSON):**
```json
{
  "title": "Mesa de Domingo",
  "maxPlayers": 4,
  "status": "active"
}
```
### 2. List All Games
* **Method:** `GET`
* **URL:** `/games`
* 
### 3. Get Game by ID
* **Method:** `GET`
* **URL:** `/games/:id`
* 
### 4. Update Game
* **Method:** `PUT`
* **URL:** `/games/:id`
```json
{
  "title": "Mesa Final",
  "status": "finished"
}
```
### 5. Delete Game
* **Method:** `DELETE`
* **URL:** `/users/:id`
* 
## Criar Score
* **Method:** `POST`
* **URL:** `/scores`
* **Body (JSON):**
```json
{
  "playerId": 1,
  "gameId": 1,
  "score": 500
}
```
### 2. List All Scores
* **Method:** `GET`
* **URL:** `/scores`
* 
### 3. Get Score by ID
* **Method:** `GET`
* **URL:** `/scores/:id`
* 
### 4. Update Score
* **Method:** `PUT`
* **URL:** `/scores/:id`
```json
{
  "score": 750
}
```
### 5. Deletar Jogo
* **Method:** `DELETE`
* **URL:** `/users/:id`
* 