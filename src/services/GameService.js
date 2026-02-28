const GameRepository = require("../repositories/GameRepository");
const GamePlayerRepository = require("../repositories/GamePlayerRepository");
const CardService = require('./CardService');

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
    
    return {
        valido: validarCriador(userId) && 
                todosProntos(jogadores) && 
                temJogadoresSuficientes(jogadores),
        erros: [
            !validarCriador(userId) && 'Apenas o criador pode iniciar a partida',
            !todosProntos(jogadores) && 'Nem todos os jogadores estão prontos',
            !temJogadoresSuficientes(jogadores) && 'Mínimo de 2 jogadores necessário'
        ].filter(Boolean) // Remove valores falsy
    };
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

    getHistory(gameId){
        return this.history[gameId] || [];
    }

    clearHistory(gameId){
       delete this.history[gameId];
    }

    async create(gameData, creatorId) {
        if (!creatorId) {
            throw new Error('Creator ID é obrigatório');
        }

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

        return game;
    }

    async findAll() {
        return await GameRepository.findAll();
    }

    async findById(id) {
        const result = await GameRepository.findById(id);
        console.log(result)
        return result
    }

    /**
     * Adicionar jogador à partida
     */
    async adicionarJogador(gameId, playerId) {
        const game = await GameRepository.findById(gameId);
        
        if (!game) {
            return { error: 'Jogo não encontrado' };
        }

        if (game.status !== 'waiting') {
            return { error: 'Jogo já iniciado ou finalizado' };
        }

        const jogadoresAtuais = await GamePlayerRepository.findByGameId(gameId);

        if (jogadoresAtuais.length >= game.maxPlayers) {
            return { error: 'Jogo já está cheio' };
        }

        // Verifica se jogador já está na partida
        const jaEstaNoJogo = jogadoresAtuais.some(j => j.playerId === playerId);
        if (jaEstaNoJogo) {
            return { error: 'Jogador já está nesta partida' };
        }

        const novoJogador = await GamePlayerRepository.create({
            gameId,
            playerId,
            ready: false,
            position: jogadoresAtuais.length + 1
        });

        return novoJogador;
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
        const jogador = await GamePlayerRepository.findOne(gameId, playerId);
        
        if (!jogador) {
            return { error: 'Jogador não está nesta partida' };
        }

        await GamePlayerRepository.update(jogador, { ready: true });
        
        this.addHistory(gameId, `Player ${playerId}`, "ready")
        
        return { message: 'Jogador marcado como pronto' };
        
    }

    /**
     * INICIAR JOGO - Validação de criador e jogadores prontos
     */
    async iniciarJogo(gameId, userId) {
        const game = await GameRepository.findById(gameId);
        
        if (!game) {
            return { error: 'Jogo não encontrado' };
        }

        if (game.status !== 'waiting') {
            return { error: 'Jogo já foi iniciado ou finalizado' };
        }

        const jogadores = await GamePlayerRepository.findByGameId(gameId);

        // VALIDAÇÃO FUNCIONAL
        const validacao = podeIniciarJogo(game, jogadores, userId);

        if (!validacao.valido) {
            return { 
                error: 'Não foi possível iniciar o jogo',
                motivos: validacao.erros
            };
        }

        // Atualiza status do jogo
        await GameRepository.update(game, {
            status: 'in_progress'
        });

        this.addHistory(gameId, `Player ${userId}`, "Started the game")

        // distribui cartas
        await this.distribuirCartas(game.id);

        // compra a primeira carta do baralho
        const primeiraCarta = await CardService.drawCard(game.id);

        this.addHistory(gameId, "System", `First card in discart pile: ${primeiraCarta.color} : ${primeiraCarta.value}`)
        // define como topo
        await GameRepository.update(game, {
            topDiscardCardId: primeiraCarta.id
        });

        return {
            message: "Jogo iniciado com sucesso",
            topCard: primeiraCarta
        }

        
    }

    /**
     * FINALIZAR JOGO - Apenas o criador pode
     */
    async finalizarJogo(gameId, userId) {
        const game = await GameRepository.findById(gameId);
        
        if (!game) {
            return { error: 'Jogo não encontrado' };
        }

        if (game.status === 'finished') {
            return { error: 'Jogo já foi finalizado' };
        }

        // VALIDAÇÃO FUNCIONAL - Apenas criador
        const validarCriador = ehCriador(game);

        if (!validarCriador(userId)) {
            return { 
                error: 'Apenas o criador da partida pode finalizá-la'
            };
        }

        await GameRepository.update(game, { status: 'finished' });

        this.addHistory(gameId,`Player ${userId}`, "end the game");

        return { 
            message: 'Jogo finalizado com sucesso!',
            game: { ...game.toJSON(), status: 'finished' }
        };
    }

    /**
 * Lógica para o jogador comprar uma carta se não tiver jogadas válidas
 */
    async comprarSeNaoPuderJogar(gameId, playerId) {
        const game = await GameRepository.findById(gameId);
        const mao = await CardService.seePlayerCards(gameId, playerId);
        const topo = await this.topoDescarte(gameId);

        // Verifica se o jogador já possui alguma carta que pode ser jogada
        const temJogadaValida = mao.some(carta =>
            carta.color === topo.color || 
            carta.value === topo.value || 
            carta.color === 'WILD'
        );
        
        if (temJogadaValida) {
            return { error: 'Você possui cartas que podem ser jogadas' };
        }

        // Se não tiver jogada, compra uma carta do baralho
        const cartaComprada = await CardService.drawToPlayer(gameId, playerId);
    
        this.addHistory(gameId, `Player ${playerId}`, `Compreu uma carta: ${cartaComprada.color} ${cartaComprada.value}`);

        // Após comprar, verifica se a carta nova pode ser jogada
        const podeJogarComprada = 
        cartaComprada.color === topo.color || 
        cartaComprada.value === topo.value || 
        cartaComprada.color === 'WILD';

        if (!podeJogarComprada) {
            // Se ainda não puder jogar, passa o turno automaticamente
            await this.proximoTurno(gameId);
            return {
                message: 'Carta comprada não pode ser jogada. Turno passado.', 
                carta: cartaComprada,
                turnoPassado: true
            };
        }
        
        return {
            message: 'Você comprou uma carta que pode ser jogada!', 
            carta: cartaComprada,
            turnoPassado: false 
        };
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
        const total = jogadores.length;
        let novaPosicao = game.currentPlayerPosition + game.direction;
        
        if (novaPosicao > total) novaPosicao = 1;
        
        if (novaPosicao < 1) novaPosicao = total;
        await GameRepository.update(game, {
            currentPlayerPosition: novaPosicao
        });

        this.addHistory(gameId, "System", `Turn changed to position ${novaPosicao}`);

        return novaPosicao;
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

    async update(id, data) {
        const game = await GameRepository.findById(id);
        if (!game) return null;

        return await GameRepository.update(game, data);
    }

    async delete(id) {
        const game = await GameRepository.findById(id);
        if (!game) return null;

        await GameRepository.delete(game);
        return true;
    }

    async seePlayerHand(gameId, playerId){
        return await CardService.seePlayerCards(gameId, playerId)
    }
    
    async obterRankingPartida(gameId) {
        const jogadores = await GamePlayerRepository.findScoresByGameId(gameId);

        if (!jogadores.length) {
            return { ranking: [] };
        }

        return {
            ranking: jogadores.map((jogador, index) => ({
                posicao: index + 1,
                playerId: jogador.playerId,
                score: jogador.score
            }))
        };
    }
}

module.exports = new GameService();