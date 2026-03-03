const GameRepository = require("../repositories/GameRepository");
const GamePlayerRepository = require("../repositories/GamePlayerRepository");
const UserRepository = require("../repositories/UserRepository")
const CardService = require('./CardService');
const Result = require("../config/result")

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
        // << PODEMOS ADINCIONAR UMA TRANSACTION NESSE METODO  >>
        try{
            const player = UserRepository.findById(creatorId)
            if(!player) return Result.fail(new Error("Jogador não existe!"), 404);

            // Cria o jogo no banco
            const game = await GameRepository.create({
                ...gameData,
                creatorId,
                status: 'waiting'
            });

            // Adiciona o criador como primeiro jogador
            await GamePlayerRepository.create({
                gameId: game.id,
                playerId: creatorId,
                ready: true, // Criador já entra pronto
                position: 1
            });

            // Gera o baralho de 108 cartas
            await CardService.createDeck(game.id);
            return Result.ok(game, 201)
        }catch(error){
            return Result.fail(error)
        }
    }

    async findAll() {
        try{
            const games = await GameRepository.findAll();
            return Result.of(games)
        }catch(error){
            return Result.fail(error)
        }
    }

    async findById(id) {
        try{
            const game = await GameRepository.findById(id);
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

            return Result.ok(novoJogador, 201)

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
        try{
            const game = await GameRepository.findById(gameId);
            if (!game) return Result.fail(new Error('Jogo não encontrado'), 404);
            const jogoFinalizado = game.status === 'finished'
            if(jogoFinalizado) return Result.fail(new Error('Jogo já foi finalizado'), 400);

            // VALIDAÇÃO FUNCIONAL - Apenas criador
            const validarCriador = ehCriador(game);
            const naoEhCriador = !validarCriador(userId)
            if (naoEhCriador) return Result.fail(new Error('Apenas o criador da partida pode finalizá-la'), 400);

            const gameModified = await GameRepository.update(gameId, { status: 'finished' });
            this.addHistory(gameId,`Player ${userId}`, "end the game");

            return Result.of( {message: 'Jogo finalizado com sucesso!', game: gameModified })

        }catch(error){
            return Result.fail(error)
        }
    }

    async abandonarJogo(gameId, playerId) {
        const game = await GameRepository.findById(gameId);
        if (!game) return { error: 'Jogo não encontrado' };

        const jogador = await GamePlayerRepository.findOne(gameId, playerId);
        if (!jogador) return { error: 'Jogador não está na partida' };

        const jogadores = await GamePlayerRepository.findByGameId(gameId);
        // Remove jogador
        await GamePlayerRepository.delete(jogador);

        this.addHistory(gameId, `Player ${playerId}`, "abandoned the game");

        const restantes = jogadores.filter(j => j.playerId !== playerId);
        // Se sobrar apenas 1 → W.O.
        if (restantes.length <= 1 && game.status === 'in_progress') {
        await GameRepository.update(game, { status: 'finished' });
        
        this.addHistory(gameId,`System`, "the game end for w.o");

        return {
            message: 'Partida encerrada por W.O.'
        };
      }
    
    // Se era o criador → transfere
     
        if (game.creatorId === playerId) {
            await GameRepository.update(game, {
            creatorId: restantes[0].playerId
        });
      }

    // Ajusta turno se necessário
    
        if (jogador.position === game.currentPlayerPosition) {
        await this.proximoTurno(gameId);
     }

      return { message: 'Jogador abandonou a partida' };
    }

    async jogadorDaVez(gameId) {
        const game = await GameRepository.findById(gameId);

        const jogador = await GamePlayerRepository.findByPosition(
            gameId,
            game.currentPlayerPosition
        );

       return jogador;
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
        console.log(jogadores)
        const total = jogadores.length;
        let novaPosicao = game.currentPlayerPosition + game.direction;
        
        if (novaPosicao > total) novaPosicao = 1;
        if (novaPosicao < 1) novaPosicao = total;

        await GameRepository.update(gameId, {
            currentPlayerPosition: novaPosicao
        });

        this.addHistory(gameId, "System", `Turn changed to position ${novaPosicao}`);

        return {
            novaPosicao,
            player: jogadores[novaPosicao - 1]
        };
    }

    async aplicarInverter(gameId) {
        const game = await GameRepository.findById(gameId);
    
        // Inverte a direção: 1 vira -1, e -1 vira 1
        const novaDirecao = game.direction * -1;
    
        await GameRepository.update(game, {
            direction: novaDirecao
        });
        
        this.addHistory(gameId, "System", `Direção de jogo invertida para: ${novaDirecao === 1 ? 'Horário' : 'Anti-horário'}`);
    
        // No UNO, se houver apenas 2 jogadores, o Reverse funciona como um Skip
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

       return await CardService.findById(
        game.topDiscardCardId
      );
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
            if (!game) Result.fail(new Error("Jogo não encontrado!"), 401);
            await GameRepository.delete(game);
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
    async jogarUmaCarta(gameId, playerId, cardId){
        // Verifica se o jogo existe
        const gameResult = await this.findById(gameId)
        if(!gameResult.ok) return gameResult

        const jogadorDaVez = await this.jogadorDaVez(gameId)
        const naoEhJogadorDaVez = jogadorDaVez.playerId !== playerId
        if(naoEhJogadorDaVez) return Result.fail("Não tente trapacear, você não é o jogador da vez", 400)

        // Joga a carta na mesa. Se tiver problema, retorna um Result sem ok válido
        const resultPlayCard = await CardService.jogarUmaCarta(gameResult.value, playerId, cardId)
        if(!resultPlayCard.ok) return resultPlayCard;

        // Atualiza o topo da pilha de descarte
        const updateResult = await this.update ( gameId, { topDiscardCardId: cardId})
        if(!updateResult.ok) return updateResult

        const playedCard = resultPlayCard.value
        const nextPlayer = await this.proximoTurno(gameId);

        // Caso seja uma carta especial de bloqueio
        if (playedCard.value === "skip"){
            const realNextPlayer = await this.proximoTurno(gameId);
            return Result.of({
                "nextPlayerPosition": realNextPlayer.novaPosicao,
                "nextPlayer": realNextPlayer.player,
                "skippedPlayer": nextPlayer.player
            })
        } 

        if (playedCard.value === "draw2"){
            await CardService.drawToPlayer(gameId, nextPlayer.player.playerId)
            await CardService.drawToPlayer(gameId, nextPlayer.player.playerId)
        }

        return Result.of({
            "nextPlayerPosition": nextPlayer.novaPosicao,
            "nextPlayer": nextPlayer.player
        })
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

    async comprarSeNaoPuderJogar(gameId, playerId){
        try{
            const topoResultado = await this.topoDescarte(gameId);
            
            const topo = topoResultado.value;

            const resultadoMao = await this.seePlayerHand(gameId, playerId);
            if(!resultadoMao.ok) return resultadoMao;

            const mao = resultadoMao.value;

            const podeJogar = CardService.validarJogada(topo);

            const cartaJogavel = mao.find(c => podeJogar(c));
            console.log("cheguei aqui 1")

            if (cartaJogavel){
                console.log("cheguei aqui 2")
                return Result.of({message: "Jogador possui carta jogável", podeJogar: true})
                
            }

            const novaCarta = await CardService.drawToPlayer(gameId, playerId);
            console.log("cheguei aqui 6")

            if(podeJogar(novaCarta)){
                console.log("cheguei aqui 3")
                return Result.of({message: "Jogador possui carta jogável", carta: novaCarta})
            }
            console.log("cheguei aqui 4")
            await this.proximoTurno(gameId);
            console.log("cheguei aqui 5")

            return Result.of({message:"Carta comprada não é jogável. Turno passado.", carta: novaCarta })
        } catch(error){
            return Result.fail(error)
        }
    }
}

module.exports = new GameService();