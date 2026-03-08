const ScoreService = require("../../../services/ScoreService");
const ScoreRepository = require("../../../repositories/ScoreRepository");

jest.mock("../../../repositories/ScoreRepository");

describe("ScoreService", () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {

    test("deve criar score com sucesso", async () => {

      const data = {
        playerId: 1,
        gameId: 2,
        score: 50
      };

      ScoreRepository.create.mockResolvedValue({
        id: 1,
        ...data
      });

      const result = await ScoreService.create(data);

      expect(result.ok).toBe(true);
      expect(result.status).toBe(201);
      expect(result.value.score.playerId).toBe(1);
    });

    test("deve falhar se dados incompletos", async () => {

      const result = await ScoreService.create({});

      expect(result.ok).toBe(false);
      expect(result.status).toBe(400);
      expect(result.error).toBeInstanceOf(Error);
    });

  });

  describe("findAll", () => {

    test("deve retornar todos os scores", async () => {

      const scores = [
        { id: 1, playerId: 1, score: 10 },
        { id: 2, playerId: 2, score: 20 }
      ];

      ScoreRepository.findAll.mockResolvedValue(scores);

      const result = await ScoreService.findAll();

      expect(result.ok).toBe(true);
      expect(result.value.score).toHaveLength(2);
    });

  });

  describe("findById", () => {

    test("deve retornar score por id", async () => {

      const score = { id: 1, playerId: 1, score: 100 };

      ScoreRepository.findById.mockResolvedValue(score);

      const result = await ScoreService.findById(1);

      expect(result.ok).toBe(true);
      expect(result.value.score.id).toBe(1);
    });

    test("deve falhar se score não existir", async () => {

      ScoreRepository.findById.mockResolvedValue(null);

      const result = await ScoreService.findById(99);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("update", () => {

    test("deve atualizar score", async () => {

      const score = { id: 1, playerId: 1, score: 50 };

      ScoreRepository.findById.mockResolvedValue(score);

      ScoreRepository.update.mockResolvedValue({
        ...score,
        score: 100
      });

      const result = await ScoreService.update(1, { score: 100 });

      expect(result.ok).toBe(true);
      expect(result.value.score.score).toBe(100);
    });

    test("deve falhar se score não existir", async () => {

      ScoreRepository.findById.mockResolvedValue(null);

      const result = await ScoreService.update(1, { score: 20 });

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("delete", () => {

    test("deve deletar score", async () => {

      const score = { id: 1 };

      ScoreRepository.findById.mockResolvedValue(score);
      ScoreRepository.delete.mockResolvedValue();

      const result = await ScoreService.delete(1);

      expect(result.ok).toBe(true);
      expect(result.value.message).toBe("Score deletado");
    });

    test("deve falhar se score não existir", async () => {

      ScoreRepository.findById.mockResolvedValue(null);

      const result = await ScoreService.delete(1);

      expect(result.ok).toBe(false);
      expect(result.status).toBe(404);
    });

  });

  describe("obterRankingGeral", () => {

    test("deve gerar ranking", async () => {

      const scores = [
        { playerId: 1, gameId: 1, score: 100, createdAt: new Date() },
        { playerId: 1, gameId: 2, score: 50, createdAt: new Date() },
        { playerId: 2, gameId: 3, score: 200, createdAt: new Date() }
      ];

      ScoreRepository.findAll.mockResolvedValue(scores);

      const result = await ScoreService.obterRankingGeral();

      expect(result.ok).toBe(true);
      expect(result.value.scores.ranking.length).toBeGreaterThan(0);
      expect(result.value.scores.somaTotal).toBe(350);
    });

    test("deve retornar ranking vazio", async () => {

      ScoreRepository.findAll.mockResolvedValue([]);

      const result = await ScoreService.obterRankingGeral();

      expect(result.ok).toBe(true);
      expect(result.value.scores.ranking).toEqual([]);
    });

  });

  describe("obterTop10", () => {

    test("deve retornar top10 jogadores", async () => {

      const scores = [];

      for (let i = 1; i <= 12; i++) {
        scores.push({
          playerId: i,
          gameId: i,
          score: i * 10,
          createdAt: new Date()
        });
      }

      ScoreRepository.findAll.mockResolvedValue(scores);

      const result = await ScoreService.obterTop10();

      expect(result.ok).toBe(true);
      expect(result.value.top10.length).toBeLessThanOrEqual(10);
    });

  });

  describe("obterEstatisticasJogador", () => {

    test("deve retornar estatísticas do jogador", async () => {

      const scores = [
        { playerId: 1, score: 100 },
        { playerId: 1, score: 50 },
        { playerId: 2, score: 200 }
      ];

      ScoreRepository.findAll.mockResolvedValue(scores);

      const result = await ScoreService.obterEstatisticasJogador(1);

      expect(result.ok).toBe(true);
      expect(result.value.estatistica.playerId).toBe(1);
      expect(result.value.estatistica.pontuacaoTotal).toBe(150);
    });

    test("deve retornar mensagem se jogador não tem scores", async () => {

      ScoreRepository.findAll.mockResolvedValue([]);

      const result = await ScoreService.obterEstatisticasJogador(99);

      expect(result.ok).toBe(true);
      expect(result.value.message).toBeDefined();
    });

  });

});