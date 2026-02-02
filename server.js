require('dotenv').config();
const app = require("./src/app");
const sequelize = require("./src/database");

const PORT = process.env.PORT || 3000;
sequelize.sync({ force: true }).then(() => {
  app.listen(3000, () => {
    sequelize.sync()
    console.log("Servidor rodando em http://localhost:3000");
  });
});