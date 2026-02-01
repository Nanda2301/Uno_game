const ScoreRepository = require("../repositories/ScoreRepository");

/**
 * REDUCE - Soma total de pontuações
 * Função pura que recebe um array e retorna um número
 */
const calcularSomaTotal = (scores) => 
    scores.reduce((acumulador, score) => acumulador + score.score, 0);

/**
 * MAP + SORT - Formatar e ordenar ranking
 * Retorna array de jogadores ordenados por pontuação
 */
const formatarRanking = (scores) => {
    // Agrupa scores por jogador usando reduce (!)
    const scoresPorJogador = scores.reduce((acc, score) => {
        const { playerId } = score;
        
        if (!acc[playerId]) {
            acc[playerId] = {
                playerId,
                totalScore: 0,
                partidas: []
            };
        }
        
        acc[playerId].totalScore += score.score;
        acc[playerId].partidas.push({
            gameId: score.gameId,
            score: score.score,
            data: score.createdAt
        });
        
        return acc;
    }, {});
    
    // Converte objeto em array e mapeia formato final
    return Object.values(scoresPorJogador)
        .map((jogador, index) => ({
            posicao: index + 1, // Será ajustado após sort
            playerId: jogador.playerId,
            pontuacaoTotal: jogador.totalScore,
            quantidadePartidas: jogador.partidas.length,
            mediaScore: jogador.totalScore / jogador.partidas.length,
            partidas: jogador.partidas
        }))
        .sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal) // Decrescente
        .map((jogador, index) => ({ ...jogador, posicao: index + 1 })); // Atualiza posição
};

/**
 * FILTER + MAP - Obter top N jogadores
 * Composição de funções de ordem superior
 */
const obterTopJogadores = (n) => (ranking) => 
    ranking.slice(0, n).map(({ playerId, pontuacaoTotal, posicao }) => ({
        posicao,
        playerId,
        pontuacaoTotal
    }));

class ScoreService {
    async create(data) {
        // Validação simples
        if (!data.playerId || !data.gameId || data.score === undefined) {
            throw new Error('Dados incompletos para criar score');
        }
        
        return await ScoreRepository.create(data);
    }

    async findAll() {
        return await ScoreRepository.findAll();
    }

    async findById(id) {
        return await ScoreRepository.findById(id);
    }

    async update(id, data) {
        const score = await ScoreRepository.findById(id);
        if (!score) return null;

        return await ScoreRepository.update(score, data);
    }

    async delete(id) {
        const score = await ScoreRepository.findById(id);
        if (!score) return null;

        await ScoreRepository.delete(score);
        return true;
    }

    /**
     * Obter ranking geral usando funções puras
     */
    async obterRankingGeral() {
        const todosScores = await ScoreRepository.findAll();
        
        if (!todosScores || todosScores.length === 0) {
            return {
                ranking: [],
                somaTotal: 0,
                totalPartidas: 0
            };
        }
        
        return {
            ranking: formatarRanking(todosScores),
            somaTotal: calcularSomaTotal(todosScores),
            totalPartidas: todosScores.length
        };
    }

    /**
     *Obter top 10 jogadores
     */
    async obterTop10() {
        const { ranking } = await this.obterRankingGeral();
        const pegarTop10 = obterTopJogadores(10);
        
        return pegarTop10(ranking);
    }

    /**
     Estatísticas de um jogador específico
     */
    async obterEstatisticasJogador(playerId) {
        const todosScores = await ScoreRepository.findAll();
        const scoresDoJogador = todosScores.filter(s => s.playerId === playerId);
        
        if (scoresDoJogador.length === 0) {
            return {
                playerId,
                pontuacaoTotal: 0,
                partidas: 0,
                media: 0
            };
        }
        
        const total = calcularSomaTotal(scoresDoJogador);
        
        return {
            playerId,
            pontuacaoTotal: total,
            partidas: scoresDoJogador.length,
            media: total / scoresDoJogador.length,
            melhorScore: Math.max(...scoresDoJogador.map(s => s.score)),
            piorScore: Math.min(...scoresDoJogador.map(s => s.score))
        };
    }
}

module.exports = new ScoreService();