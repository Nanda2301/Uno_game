const Result = require("../config/result");
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
        try{
            // Validação simples
            if (!data.playerId || !data.gameId || data.score === undefined) {
                throw new Error('Dados incompletos para criar score');
            }

            const scoreNewPlayer = await ScoreRepository.create(data);
        
            return Result.of({message: "Score criado com sucesso!", score: scoreNewPlayer});

        }catch(error){
            return Result.fail(error)
        }
        
    }

    async findAll() {
        try{
            const scores = await ScoreRepository.findAll();
            return Result.of({message: "Scores encontrados com sucesso", score: scores})
        } catch(error){
            return Result.fail(error)
        }
         
    }

    async findById(id) {
        try{
            const scoreById = await ScoreRepository.findById(id);
            return Result.of({message: "Score do jogador encontrado", score: scoreById})
        } catch(error){
            return Result.fail(error)
        } 
    }

    async delete(id) {
        try{
            const score = await ScoreRepository.findById(id);
        if (!score) return Result.fail(new Error("Score não encontrado"), 404);

        await ScoreRepository.delete(score);
        return Result.of({message:"Score deletado"});

        }catch(error){
            return Result.fail(error)
        } 
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