const Result = require("../config/result");
const ScoreRepository = require("../repositories/ScoreRepository");

const calcularSomaTotal = (scores) =>
  scores.reduce((acumulador, score) => acumulador + score.score, 0);

const formatarRanking = (scores) => {
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

  return Object.values(scoresPorJogador)
    .map((jogador) => ({
      playerId: jogador.playerId,
      pontuacaoTotal: jogador.totalScore,
      quantidadePartidas: jogador.partidas.length,
      mediaScore: jogador.totalScore / jogador.partidas.length,
      partidas: jogador.partidas
    }))
    .sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal)
    .map((jogador, index) => ({
      posicao: index + 1,
      ...jogador
    }));
};

const obterTopJogadores = (n) => (ranking) =>
  ranking.slice(0, n).map(({ playerId, pontuacaoTotal, posicao }) => ({
    posicao,
    playerId,
    pontuacaoTotal
  }));

class ScoreService {
  async create(data) {
    try {
      if (!data.playerId || !data.gameId || data.score === undefined) {
        return Result.fail(new Error("Dados incompletos para criar o score"), 400);
      }

      const scoreNewPlayer = await ScoreRepository.create(data);
      return Result.ok(
        { message: "Score criado com sucesso!", score: scoreNewPlayer },
        201
      );
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async findAll() {
    try {
      const scores = await ScoreRepository.findAll();
      return Result.of({ message: "Scores encontrados com sucesso", score: scores });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async findById(id) {
    try {
      const score = await ScoreRepository.findById(id);

      if (!score) {
        return Result.fail(new Error("Score não encontrado"), 404);
      }

      return Result.of({ message: "Score encontrado com sucesso", score });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async update(id, data) {
    try {
      const score = await ScoreRepository.findById(id);

      if (!score) {
        return Result.fail(new Error("Score não encontrado"), 404);
      }

      const updated = await ScoreRepository.update(score, data);
      return Result.of({ message: "Score atualizado com sucesso", score: updated });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async delete(id) {
    try {
      const score = await ScoreRepository.findById(id);

      if (!score) {
        return Result.fail(new Error("Score não encontrado"), 404);
      }

      await ScoreRepository.delete(score);
      return Result.of({ message: "Score deletado" });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async obterRankingGeral() {
    try {
      const todosScores = await ScoreRepository.findAll();

      if (!todosScores || todosScores.length === 0) {
        return Result.of({ message: "O ranking está vazio no momento", scores: { ranking: [] } });
      }

      const ranking = formatarRanking(todosScores);

      return Result.of({
        message: "Ranking obtido com sucesso!",
        scores: {
          ranking,
          somaTotal: calcularSomaTotal(todosScores),
          totalPartidas: todosScores.length
        }
      });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async obterTop10() {
    try {
      const rankingResult = await this.obterRankingGeral();
      if (!rankingResult.ok) return rankingResult;

      const ranking = rankingResult.value?.scores?.ranking || [];
      const pegarTop10 = obterTopJogadores(10);

      return Result.of({
        message: "Top 10 obtido com sucesso!",
        top10: pegarTop10(ranking)
      });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }

  async obterEstatisticasJogador(playerId) {
    try {
      const todosScores = await ScoreRepository.findAll();
      const scoresDoJogador = todosScores.filter((s) => s.playerId === playerId);

      if (scoresDoJogador.length === 0) {
        return Result.of({ message: "Não há estatísticas para o jogador no momento" });
      }

      const total = calcularSomaTotal(scoresDoJogador);

      return Result.of({
        message: "Estatísticas obtidas com sucesso!",
        estatistica: {
          playerId,
          pontuacaoTotal: total,
          partidas: scoresDoJogador.length,
          media: total / scoresDoJogador.length,
          melhorScore: Math.max(...scoresDoJogador.map((s) => s.score)),
          piorScore: Math.min(...scoresDoJogador.map((s) => s.score))
        }
      });
    } catch (error) {
      return Result.fail(error, 500);
    }
  }
}

module.exports = new ScoreService();