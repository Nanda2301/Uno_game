const app = require("./src/app");
const sequelize = require("./src/database");

sequelize.sync().then(() => {
  app.listen(3000, () => {
    sequelize.sync()
    console.log("Servidor rodando em http://localhost:3000");
  });
});