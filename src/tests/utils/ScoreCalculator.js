
export const agruparPorJogador = (scores) => 
    scores.reduce((acc, score) => {
        if (!acc[score.playerId]) {
            acc[score.playerId] = { playerId: score.playerId, totalScore: 0, partidas: [] };
        }
        acc[score.playerId].totalScore += score.score;
        acc[score.playerId].partidas.push(score);
        return acc;
    }, {});

export const calcularSomaTotal = (scores) => 
    scores.reduce((acumulador, score) => acumulador + score.score, 0);