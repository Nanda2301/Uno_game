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
                return Result.fail("Dados incompletos para criar o score")
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
        try{
            const todosScores = await ScoreRepository.findAll();
        
            if (!todosScores || todosScores.length === 0) return Result.of({message: "O ranking está vazio no momento"})
            
            const scores = {
                ranking: formatarRanking(todosScores),
                somaTotal: calcularSomaTotal(todosScores),
                totalPartidas: todosScores.length
            };

            return Result.of({message: "Ranking obtido com sucesso!", scores: scores})

        }catch(error){
            return Result.fail(error)
        }
        
    }

    /**
     *Obter top 10 jogadores
     */
    async obterTop10() {
        try{
            const { ranking } = await this.obterRankingGeral();
            const pegarTop10 = obterTopJogadores(10);
            
            return Result.of({message: "Top 10 obtido com sucesso!", pegarTop10: pegarTop10(ranking)});

        }catch(error){
            return Result.fail(error)
        }
        
    }

    /**
     Estatísticas de um jogador específico
     */
    async obterEstatisticasJogador(playerId) {
        try{
            const todosScores = await ScoreRepository.findAll();
            const scoresDoJogador = todosScores.filter(s => s.playerId === playerId);
            
            if (scoresDoJogador.length === 0) return Result.of({message: "Não há estatísticas para o jogador no momento"})
            
            const total = calcularSomaTotal(scoresDoJogador);
            
            const estatistica = {
                playerId,
                pontuacaoTotal: total,
                partidas: scoresDoJogador.length,
                media: total / scoresDoJogador.length,
                melhorScore: Math.max(...scoresDoJogador.map(s => s.score)),
                piorScore: Math.min(...scoresDoJogador.map(s => s.score))
            };

            return Result.of({message: "Estatísticas obtidas com sucesso!", estatistica: estatistica})
        }catch(error){
            return Result.fail(error)
        }  
    }
}

module.exports = new ScoreService();