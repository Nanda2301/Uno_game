# UNO project

A REST API built with Node.js, Express, and Sequelize, using SQLite as the database. This project provides basic user management endpoints and follows common backend best practices.

## Technologies & Packages
The project uses the following main dependencies:

- **express** – Web framework for building APIs

- **sequelize** – ORM for database management

- **sqlite3** – Lightweight relational database

- **bcrypt**– Password hashing

- **jsonwebtoken** - Acess token

## Getting started 
### Prerequisites
Make sure you have the following installed:
- Node.Js
- npm

### Installation
Install the project dependencies with `npm ci`

### Running the project
Start the development server with `npm run dev`

## API endpoint

### User manager
Base URL: `/uno/users`

#### Get User by ID
**Method:** `GET`
**Endpoint:** `/uno/users`

**Success Response**
**Status:** `200 OK`
```
{
    "id": 1,
    "name": "string",
    "email": "string",
    "password": "string",
    "createdAt": "2026-01-22T02:08:52.677Z",
    "updatedAt": "2026-01-22T02:08:52.677Z"
}
```
**Error Response**
**Status:** `404 Not Found`
```
{
    "error": "User not found"
}
```

#### Get All Users
**Method:** `GET`
**Endpoint:** `/uno/users/all`
**Succedd Response**
**Status:** `200 OK`
```
[
    {
        "id": 1,
        "name": "string",
        "email": "string",
        "password": "string",
        "createdAt": "2026-01-22T02:08:52.677Z",
        "updatedAt": "2026-01-22T02:08:52.677Z"
    },
    {
        "id": 2,
        "name": "string",
        "email": "string",
        "password": "string",
        "createdAt": "2026-01-22T02:08:52.677Z",
        "updatedAt": "2026-01-22T02:08:52.677Z"
    }
]
```