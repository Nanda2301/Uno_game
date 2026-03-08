require('dotenv').config();
const app = require("./src/app");
const sequelize = require("./src/database");

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await sequelize.authenticate();   // Verifica a conexão com o banco de dados
    await sequelize.sync();           // Cria as tabelas de todos os modelos
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicação:", error);
    process.exit(1);
  }
}

bootstrap();