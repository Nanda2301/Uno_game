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
        return await GameRepository.findById(id);
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

    /**
     * Marcar jogador como pronto
     */
    async marcarPronto(gameId, playerId) {
        const jogador = await GamePlayerRepository.findOne(gameId, playerId);
        
        if (!jogador) {
            return { error: 'Jogador não está nesta partida' };
        }

        await GamePlayerRepository.update(jogador, { ready: true });
        
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
        await GameRepository.update(game, { status: 'in_progress' });

        return { 
            message: 'Jogo iniciado com sucesso!',
            game: { ...game.toJSON(), status: 'in_progress' }
        };
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

        return { 
            message: 'Jogo finalizado com sucesso!',
            game: { ...game.toJSON(), status: 'finished' }
        };
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
}

module.exports = new GameService();