const GameRepository = require("../repositories/GameRepository");
const GamePlayerRepository = require("../repositories/GamePlayerRepository");
const UserRepository = require("../repositories/UserRepository")
const CardService = require('./CardService');
const Result = require("../config/result")
const ScoreService = require("./ScoreService")

/**
 * Verifica se o usuário é o criador do jogo
 */
const ehCriador = (game) => (userId) => 
    game.creatorId === parseInt(userId);

/**
 * Verifica se todos os jogadores estão prontos
 */
const todosProntos = (jogadores) => 
    jogadores.every(jogador => jogador.ready === true);

/**
 * Verifica se tem jogadores suficientes (mínimo 2)
 */
const temJogadoresSuficientes = (jogadores) => 
    jogadores.length >= 2;

/**
 * Validação composta para iniciar jogo
 */
const podeIniciarJogo = (game, jogadores, userId) => {
    const validarCriador = ehCriador(game);
    if(!validarCriador(userId)) return Result.fail(new Error('Apenas o criador pode iniciar a partida'), 401);
    if(!todosProntos(jogadores)) return Result.fail(new Error('Nem todos os jogadores estão prontos'), 400);
    if(!temJogadoresSuficientes(jogadores)) return Result.fail(new Error('Mínimo de 2 jogadores necessário'), 400);

    return Result.ok({})
};

class GameService {
    /**
     * Criar novo jogo
     */
    constructor(){
        this.history = {};
        this.unoStatus = {};
    }

    addHistory(gameId, player, action){
         if (!this.history[gameId]) {
        this.history[gameId] = [];
        }

        this.history[gameId].push({
            player,
            action,
            timestamp: new Date()
        });
    }

    async getHistory(gameId){
        try{
            const gameExists = await GameRepository.gameExists(gameId)
            if(!gameExists) return Result.fail(new Error("Partida não encontrada!"), 404);
            
            const history = this.history[gameId]
            if(!history) return Result.ok("Nenhum histórico foi encontrado para a partida", 204);
            return Result.of(history)
        }catch(error){
            return Result.fail(error)
        }
    }

    clearHistory(gameId){
       delete this.history[gameId];
    }

    async create(gameData, creatorId) {
      try{
        
        const player = await UserRepository.findById(creatorId)

        if(!player)
          return Result.fail(new Error("Jogador não existe!"), 404)

        const maxPlayers = gameData.maxPlayers || 4

        const game = await GameRepository.create({
            ...gameData,
            maxPlayers,
            creatorId,
            status: 'waiting'
        })

        await GamePlayerRepository.create({
            gameId: game.id,
            playerId: creatorId,
            ready: true,
            position: 1
        })

        const data = {
            playerId: creatorId,
            gameId: game.id,
            score: 0
        }

        const resultScore = await ScoreService.create(data)

        if(!resultScore.ok)
            return Result.fail(resultScore.error)

        await CardService.createDeck(game.id)

        return Result.ok(game, 201)

    }catch(error){

      return Result.fail(error)

    }
  }

    async findAll() {
      
      try{
        
        const games = await GameRepository.findAll()

        const gamesWithPlayers = await Promise.all(
          
          games.map(async (game)=>{
            
            const players = 
                await GamePlayerRepository.findByGameId(game.id)

            return {
              ...game,
              players
            }
          })
        )
        
        return Result.of(gamesWithPlayers)
      
      }catch(error){
        
        return Result.fail(error)
      }

    }

    async findById(id) {
        try{
            const game = await GameRepository.findById(id, false);
            if(!game) return Result.fail("Game not found", 404);
            return Result.of(game)
        }catch(error){
            return Result.fail(error)
        }
    }

    /**
     * Adicionar jogador à partida
     */
    async adicionarJogador(gameId, playerId) {
        try{
            const game = await GameRepository.findById(gameId);

            // Verificação de consistência do jogo
            if(!game) return Result.fail(new Error("Jogo não encontrado!"));
            if (game.status !== 'waiting') return Result.fail(new Error("Jogo já iniciado ou finalizado"));

            // Verifica se tem espaço na sala
            const jogadoresAtuais = await GamePlayerRepository.findByGameId(gameId);
            const salaCheia = jogadoresAtuais.length >= game.maxPlayers
            if (salaCheia) return Result.fail(new Error("Jogo já está cheio"));

            // Verifica se jogador já está na partida
            const jaEstaNoJogo = jogadoresAtuais.some(j => j.playerId === playerId);
            if (jaEstaNoJogo) return Result.fail(new Error("Jogador já está nesta partida"));

            const novoJogador = await GamePlayerRepository.create({
                gameId,
                playerId,
                ready: false,
                position: jogadoresAtuais.length + 1
            });

            const data = {
                playerId: playerId, 
                gameId: gameId,
                score: 0
            }

            const resultScore = await ScoreService.create(data)
            if(!resultScore.ok) return 

            return Result.ok(novoJogador, 200) // Não faz sentido ser 201

        }catch(error){
            return Result.fail(error)
        }
    }
    
    async distribuirCartas(gameId) {
        const jogadores =
            await GamePlayerRepository.findByGameId(gameId);

        for (const jogador of jogadores) {
            for (let i = 0; i < 7; i++) {
                await CardService.drawToPlayer(
                    gameId,
                    jogador.playerId
                );
            }
        }

        this.addHistory(gameId, "System", "Cards dealt");
    }
    /**
     * Marcar jogador como pronto
     */
    async marcarPronto(gameId, playerId) {
        try{
            //procura jogador na partida
            const jogador = await GamePlayerRepository.findOne(gameId, playerId);
            if (!jogador) return Result.fail('Jogador não está nesta partida', 400);
            //Atualiza o status do jogador para pronto
            await GamePlayerRepository.update(jogador, { ready: true });
            this.addHistory(gameId, `Player ${playerId}`, "ready")
            return Result.of({ message: 'Jogador marcado como pronto' })
        }catch(error){
            return Result.fail(error)
        }
    }

    /**
     * INICIAR JOGO - Validação de criador e jogadores prontos
     */
    async iniciarJogo(gameId, userId) {
        try{
            // Procura pela partida solicitada
            const game = await GameRepository.findById(gameId);
            if(!game) return Result.fail(new Error("Partida não encontrada"), 404);

            // Verifica se o jogo não começou
            const jogoIniciado = game.status !== 'waiting'
            if(jogoIniciado) return Result.fail(new Error("Jogo já foi iniciado ou finalizado"), 400);

            // Verifica se está tudo certo para iniciar a partida
            const jogadores = await GamePlayerRepository.findByGameId(gameId);
            const validacao = podeIniciarJogo(game, jogadores, userId);
            if (!validacao.ok) {
                const mensage = `Não foi possível iniciar o jogo: ${validacao.error.message}`;
                return Result.fail(new Error(mensage), validacao.status)
            }

            await GameRepository.update(gameId, {status: 'in_progress'}); // Atualiza status do jogo
            this.addHistory(gameId, `Player ${userId}`, "Started the game")
            await this.distribuirCartas(gameId); // distribui cartas

            // compra a primeira carta do baralho
            const primeiraCarta = await CardService.drawCard(gameId);
            this.addHistory(gameId, "System", `First card in discart pile: ${primeiraCarta.color} : ${primeiraCarta.value}`)
            
            // define como topo
            await GameRepository.update(gameId, {
                topDiscardCardId: primeiraCarta.id
            });

            return Result.of({
                message: "Jogo iniciado com sucesso",
                topCard: primeiraCarta
            })

        }catch(error){
            return Result.fail(error)
        }
    }

    /**
     * FINALIZAR JOGO - Apenas o criador pode
     */
    async finalizarJogo(gameId, userId) {
      try {
        const game = await GameRepository.findById(gameId);
        if (!game) return Result.fail(new Error("Jogo não encontrado"), 404);

        if (game.status === "finished") {
          return Result.fail(new Error("Jogo já foi finalizado"), 400);
        }

        if (game.creatorId !== Number(userId)) {
          return Result.fail(new Error("Apenas o criador da partida pode finalizá-la"), 400);
        }

        const gameModified = await GameRepository.update(gameId, { status: "finished" });
        this.addHistory(gameId, `Player ${userId}`, "end the game");

        return Result.of({
          message: "Jogo finalizado com sucesso!",
          game: gameModified
        });
      } catch (error) {
        return Result.fail(error, 500);
      }
    }

    async abandonarJogo(gameId, playerId) {
      try {
        const game = await GameRepository.findById(gameId);
        if (!game) return Result.fail(new Error("Jogo não encontrado"), 404);

        const jogador = await GamePlayerRepository.findOne(gameId, playerId);
        if (!jogador) return Result.fail(new Error("Jogador não está na partida"), 404);

        const jogadores = await GamePlayerRepository.findByGameId(gameId);

        await GamePlayerRepository.delete(jogador);
        this.addHistory(gameId, `Player ${playerId}`, "abandoned the game");

        const restantes = jogadores.filter((j) => Number(j.playerId) !== Number(playerId));

        await this.reorganizarPosicoes(gameId);

        if (restantes.length <= 1 && game.status === "in_progress") {
          await GameRepository.update(gameId, { status: "finished" });
          this.addHistory(gameId, "System", "the game end for w.o");

          return Result.of({
            message: "Partida encerrada por W.O."
          });
        }

        if (game.creatorId === Number(playerId) && restantes.length > 0) {
          await GameRepository.update(gameId, {
            creatorId: restantes[0].playerId
          });
        }

        if (jogador.position === game.currentPlayerPosition && restantes.length > 0) {
          await this.proximoTurno(gameId);
        }

        return Result.of({
          message: "Jogador abandonou a partida",
          player: playerId
        });
      } catch (error) {
        return Result.fail(error, 500);
      }
    }

    async jogadorDaVez(gameId) {
        const game = await GameRepository.findById(gameId);

        const jogador = await GamePlayerRepository.findByPosition(
            gameId,
            game.currentPlayerPosition
        );

       return jogador;
    }

    calculateCardScore(card) {
        if (!isNaN(card.value)) return parseInt(card.value); // 0-9
        if (["skip", "reverse", "draw2"].includes(card.value)) return 20;
        if (["wild", "draw4"].includes(card.value)) return 50;
        return 0;
    }

    // Método para verificar fim de jogo e calcular pontos
    async checkGameOver(gameId) {
        const players = await GamePlayerRepository.findByGameId(gameId);
        // Vence quem ficar com 0 cartas
        const winner = players.find(p => p.hand && p.hand.length === 0);
        
        if (winner) {
            const scores = {};
            players.forEach(p => {
                // Soma os pontos das cartas que restaram na mão dos perdedores
                scores[p.playerName] = p.hand.reduce((total, card) => {
                    return total + this.calculateCardScore(card);
                }, 0);
            });
            
            await GameRepository.update(gameId, { status: 'finished' });
            return { winner: winner.playerName, scores };
        }

        return null;
    }

    async proximoTurno(gameId) {
      const game = await GameRepository.findById(gameId);
      const jogadores = await GamePlayerRepository.findByGameId(gameId);

      const total = jogadores.length;
      if (total === 0) {
        throw new Error("Não há jogadores na partida");
      }

      let novaPosicao = game.currentPlayerPosition + game.direction;

      if (novaPosicao > total) novaPosicao = 1;
      if (novaPosicao < 1) novaPosicao = total;

      await GameRepository.update(gameId, {
        currentPlayerPosition: novaPosicao
      });

      this.addHistory(gameId, "System", `Turn changed to position ${novaPosicao}`);

      const jogadorAtual = await GamePlayerRepository.findByPosition(gameId, novaPosicao);

      return {
        novaPosicao,
        player: jogadorAtual
      };
    }

    async aplicarInverter(gameId) {
      const game = await GameRepository.findById(gameId);

      const novaDirecao = game.direction * -1;

      await GameRepository.update(gameId, {
        direction: novaDirecao
      });

      this.addHistory(
        gameId,
        "System",
        `Direção de jogo invertida para: ${novaDirecao === 1 ? "Horário" : "Anti-horário"}`
      );

      const jogadores = await GamePlayerRepository.findByGameId(gameId);
      if (jogadores.length === 2) {
        await this.proximoTurno(gameId);
      }
    }

    async aplicarPular(gameId) {
        // Primeiro avanço: passa o turno do jogador que jogou o Skip
        await this.proximoTurno(gameId);
    
        // Segundo avanço: pula o próximo jogador
        const jogadorPuladoPosicao = await this.proximoTurno(gameId);
    
        this.addHistory(gameId, "System", `Jogador na posição ${jogadorPuladoPosicao} foi pulado`);
    }


    async topoDescarte(gameId) {
      const game = await GameRepository.findById(gameId);

      if (!game) {
        return Result.fail(new Error("Jogo não encontrado"), 404);
      }

      if (!game.topDiscardCardId) {
        return Result.fail(new Error("Não existe carta no topo do descarte"), 404);
      }

      return CardService.findById(game.topDiscardCardId);
    }

    async update(id, data, options={}) {
        try{
            const info = await GameRepository.update(id, data, options);
            if(info) return Result.of(info);
            return Result.fail(new Error("Jogo não encontrado"), 401)
        }catch(error){
            return Result.fail(error)
        }
    }

    async delete(id) {
        try{
            const game = await GameRepository.findById(id);
            if (!game) return Result.fail(new Error("Jogo não encontrado!"), 401);
            await GameRepository.delete(id);
            return Result.of({mensage: "Jogo removido com sucesso!"})
        }catch(error){
            return Result.fail(error)
        }
    }

    async seePlayerHand(gameId, playerId){
        return await CardService.seePlayerCards(gameId, playerId)
    }

    /**
     * Delega a ação de descartar uma carta ao serviço responsável.
     *
     * @async
     * @method jogarUmaCarta
     * @memberof GameService
     *
     * @param {number} gameId   - ID da partida
     * @param {number} playerId - ID do jogador que está descartando a carta
     * @param {number} cardId   - ID da carta a ser descartada
     *
     * @returns {Promise<Result>} Retorna o Result produzido por `CardService.jogarUmaCarta`
     *
     * @see CardService.jogarUmaCarta
     */
    async jogarUmaCarta(gameId, playerId, cardId) {
      try {
        const gameResult = await this.findById(gameId);
        if (!gameResult.ok) return gameResult;

        const game = gameResult.value;

        if (game.status !== "in_progress") {
          return Result.fail(new Error("O jogo não está em andamento, você não pode jogar ainda"), 400);
        }

        const jogadorDaVez = await this.jogadorDaVez(gameId);
        if (!jogadorDaVez || Number(jogadorDaVez.playerId) !== Number(playerId)) {
          return Result.fail(new Error("Não tente trapacear, você não é o jogador da vez"), 400);
        }

        const topResult = await this.topoDescarte(gameId);
        if (!topResult.ok) return topResult;

        const cardResult = await CardService.findById(cardId);
        if (!cardResult.ok) return cardResult;

        const validarJogada = CardService.validarJogada(topResult.value);
        if (!validarJogada(cardResult.value)) {
          return Result.fail(new Error("A carta jogada não é válida, jogue outra carta"), 400);
        }

        const resultPlayCard = await CardService.jogarUmaCarta(game, playerId, cardId);
        if (!resultPlayCard.ok) return resultPlayCard;

        await GameRepository.update(gameId, { topDiscardCardId: cardId });

        const playedCard = resultPlayCard.value;
        this.addHistory(gameId, `Player ${playerId}`, `played ${playedCard.color}-${playedCard.value}`);

        if (playedCard.value === "reverse") {
          await this.aplicarInverter(gameId);
        }

        let nextPlayer = await this.proximoTurno(gameId);

        if (playedCard.value === "skip") {
          const skippedPlayer = nextPlayer.player;
          nextPlayer = await this.proximoTurno(gameId);

          return Result.of({
            playedCard,
            nextPlayerPosition: nextPlayer.novaPosicao,
            nextPlayer: nextPlayer.player,
            skippedPlayer
          });
        }

        if (playedCard.value === "draw2") {
          const penalizedPlayer = nextPlayer.player;

          await CardService.drawToPlayer(gameId, penalizedPlayer.playerId);
          await CardService.drawToPlayer(gameId, penalizedPlayer.playerId);

          nextPlayer = await this.proximoTurno(gameId);

          return Result.of({
            playedCard,
            penalizedPlayer,
            nextPlayerPosition: nextPlayer.novaPosicao,
            nextPlayer: nextPlayer.player
          });
        }

        const handAfterPlay = await this.seePlayerHand(gameId, playerId);
        if (handAfterPlay.ok && handAfterPlay.value.length === 0) {
          await GameRepository.update(gameId, { status: "finished" });

          return Result.of({
            message: "Jogada realizada e a partida foi encerrada",
            winner: playerId,
            playedCard
          });
        }

        return Result.of({
          playedCard,
          nextPlayerPosition: nextPlayer.novaPosicao,
          nextPlayer: nextPlayer.player
        });
      } catch (error) {
        return Result.fail(error, 500);
      }
    }
    
    async obterRankingPartida(gameId) {
        try{
            // Verifica se o jogo existe
            const gameExists = await GameRepository.gameExists(gameId);
            if(!gameExists) return Result.fail(new Error("Partida não encontrada"), 404);
            
            // Procura pelos jogadores na partida e monta o ranking
            const jogadores = await GamePlayerRepository.findScoresByGameId(gameId);
            const ranking = jogadores.map((jogador, index) =>({
                position: index + 1,
                playerId: jogador.playerId,
                score: jogador.score
            }))
            return Result.of({ranking})
            
        }catch(error){
            return Result.fail(error)
        }
    }

    async comprarSeNaoPuderJogar(gameId, playerId) {
      try {
        const game = await GameRepository.findById(gameId);

        if (!game) return Result.fail(new Error("O jogo não foi encontrado"), 404);
        if (game.status !== "in_progress") {
          return Result.fail(new Error("O jogo não está em andamento, você não pode comprar uma carta"), 400);
        }

        const jogadorDaVez = await this.jogadorDaVez(gameId);
        if (!jogadorDaVez || Number(jogadorDaVez.playerId) !== Number(playerId)) {
          return Result.fail(new Error("Não é a sua vez"), 400);
        }

        const topoResultado = await this.topoDescarte(gameId);
        if (!topoResultado.ok) return topoResultado;

        const resultadoMao = await this.seePlayerHand(gameId, playerId);
        if (!resultadoMao.ok) return resultadoMao;

        const topo = topoResultado.value;
        const mao = resultadoMao.value;
        const podeJogar = CardService.validarJogada(topo);

        const cartaJogavel = mao.find((carta) => podeJogar(carta));
        if (cartaJogavel) {
          return Result.fail(new Error("Jogador possui carta jogável e não pode comprar"), 400);
        }

        const novaCarta = await CardService.drawToPlayer(gameId, playerId);

        if (podeJogar(novaCarta)) {
          return Result.of({
            message: "Carta comprada. Você pode jogá-la nesta rodada.",
            canPlay: true,
            carta: novaCarta
          });
        }

        await this.proximoTurno(gameId);

        return Result.of({
          message: "Carta comprada não é jogável. Turno passado.",
          canPlay: false,
          carta: novaCarta
        });
      } catch (error) {
        return Result.fail(error, 500);
      }
    }

    async dizerUno(gameId, playerId) {
        const maoResult = await CardService.seePlayerCards(gameId, playerId);
        // Retorna erro caso ocorra um problema na procura por cartas
        if(!maoResult.ok) return maoResult 
        
        const mao = maoResult.value
        if (mao.length !== 1) {
            return Result.fail("Você só pode dizer UNO quando tiver exatamente 1 carta!", 400);
        }
        
        if (!this.unoStatus[gameId]) this.unoStatus[gameId] = {};
        this.unoStatus[gameId][playerId] = true;
    
        this.addHistory(gameId, `Player ${playerId}`, "Disse UNO!");
        return Result.ok({ message: "UNO registrado!" });
    }
    
    async desafiarUno(gameId, denuncianteId, denunciadoId) {
        const maoDenunciado = await CardService.seePlayerCards(gameId, denunciadoId);
        const disseUno = this.unoStatus[gameId] && this.unoStatus[gameId][denunciadoId];

        // Se ele tem 1 carta e NÃO disse UNO
        if (maoDenunciado.value.length === 1 && !disseUno) {
            // Punição: compra 2 cartas
            await CardService.drawToPlayer(gameId, denunciadoId);
            await CardService.drawToPlayer(gameId, denunciadoId);
            this.addHistory(gameId, "System", `Jogador ${denunciadoId} foi penalizado por não dizer UNO.`);
            return Result.ok({ message: "Desafio aceito! O jogador comprou 2 cartas." });
        }
        return Result.fail("O jogador está seguro ou não tem apenas uma carta.", 400);
    }

    async reorganizarPosicoes(gameId) {
      const jogadores = await GamePlayerRepository.findByGameId(gameId);

      for (let i = 0; i < jogadores.length; i += 1) {
        const novaPosicao = i + 1;
        if (jogadores[i].position !== novaPosicao) {
          await GamePlayerRepository.update(jogadores[i], { position: novaPosicao });
        }
      }
    }
}

module.exports = new GameService();