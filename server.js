require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const sequelize = require("./src/database");

const { initSocket } = require("./src/sockets/socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// registra socket global
initSocket(io);

io.on("connection", (socket) => {

  console.log("Player connected:", socket.id);

  socket.on("joinGame", (gameId) => {
    socket.join(`game-${gameId}`);
  });

  socket.on("leaveGame", (gameId) => {
    socket.leave(`game-${gameId}`);
  });

});

async function bootstrap() {
  try {

    await sequelize.authenticate();
    console.log("Banco conectado");

    await sequelize.sync();
    console.log("Modelos sincronizados");

    server.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });

  } catch (error) {

    console.error("Erro ao iniciar aplicação:", error);
    process.exit(1);

  }
}

bootstrap();