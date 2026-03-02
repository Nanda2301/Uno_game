const { where } = require("sequelize");
const sequelize = require("../database")
const CardRepository = require("../repositories/CardRepository");
const Result = require("../config/result")
const GameRepository = require("../repositories/GameRepository");
const { raw } = require("express");


const podeJogar = (cartaNoTopo) => (cartaJogada) => {
    if (cartaJogada.color === 'black') return true;
        return cartaNoTopo.color === cartaJogada.color || 
           cartaNoTopo.value === cartaJogada.value;
};

const embaralhar = (deck) => {
    const novoArray = [...deck];
    
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    
    return novoArray;
};


const criarCarta = (gameId) => (color) => (value) => ({
    gameId,
    color,
    value,
    especial: ['skip', 'reverse', 'draw2', 'wild', 'wild_draw4'].includes(value),
    efeito: obterEfeito(value)
});

const obterEfeito = (value) => {
    const efeitos = {
        'skip': 'PULAR_PROXIMO',
        'reverse': 'INVERTER_ORDEM',
        'draw2': 'COMPRAR_2',
        'wild': 'ESCOLHER_COR',
        'wild_draw4': 'COMPRAR_4_E_ESCOLHER_COR'
    };
    
    return efeitos[value] || null;
};


const gerarCartasPorCor = (gameId, color) => {
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                    'skip', 'reverse', 'draw2'];
    
    const criarCartaDaCor = criarCarta(gameId)(color);
    
    return values.flatMap(value => 
        value === '0' 
            ? [criarCartaDaCor(value)] 
            : [criarCartaDaCor(value), criarCartaDaCor(value)]
    );
};


const gerarCartasPretas = (gameId) => {
    const wildCards = ['wild', 'wild_draw4'];
    const criarCartaPreta = criarCarta(gameId)('black');
    
    return wildCards.flatMap(value => 
        Array(4).fill(null).map(() => criarCartaPreta(value))
    );
};

class CardService {

   
    async createDeck(gameId) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        
        const cartasColoridas = colors.flatMap(cor => 
            gerarCartasPorCor(gameId, cor)
        );
        
        const cartasPretas = gerarCartasPretas(gameId);
        
        const baralhoCompleto = embaralhar([...cartasColoridas, ...cartasPretas]);
        
        // Persiste no banco
        return await CardRepository.createMany(baralhoCompleto);
    }

    async create(data) {
        if (!data.color) return Result.fail(new Error("Cor da carta não informada!"), 400);
        if (!data.value) return Result.fail(new Error("Valor da carta não informado!"), 400);
        if (!data.gameId) return Result.fail(new Error("Id do jogo não informado!"), 400);
        if (!data.pile) return Result.fail(new Error("Pilha não informada!"), 400);
        try{
            const newCard = await CardRepository.create(data);
            return Result.ok(newCard, 201)
        }catch(error){
            return Result.fail(error)
        }
    }

    async findAll() {
        try{
            const data = await CardRepository.findAll();
            return Result.of(data)
        }catch(error){
            return Result.fail(error)
        }
    }

    async findById(id) {
        try {
            if (!id) return Result.fail(new Error("Id de carta não inserido!"), 400);

            const card = await CardRepository.findById(id);
            if(!card) return Result.fail("Carta não encontrada!", 404);

            // Uso de Functor para transformar o dado sem mutação direta
            return Result.of(card)
            .map(c => (c.toJSON ? c.toJSON() : c))
            .map(c => ({
                ...c,
                label: `${c.color.toUpperCase()} - ${c.value}`,
                viewedAt: new Date().toISOString()
            }));
        } catch (error) {
            return Result.fail(error)
        }
    }

    async update(id, data) {
        try{
            const cardUpdated = await CardRepository.update(id, data);
            if(cardUpdated) return Result.of(cardUpdated);
            return Result.fail(new Error("Carta não encontrada para update"), 404)
        }catch(error){
            return Result.fail(error)
        }
    }

    async delete(id) {
        try{
            const card = await CardRepository.findById(id);
            if (!card) return Result.fail(new Error("Card not found to remove"), 404);
            await CardRepository.delete(card);
            return Result.of({Mensage: "Removido com sucesso"})
        }catch(error){
            return Result.fail(error)
        }
    }

    async drawCard(gameId) {
        const card = await CardRepository.findOne({
            where: {
                gameId,
                pile: 'draw'
            }
        });

        if (!card) {
            throw new Error('O baralho de compra está vazio!');
        }

    await CardRepository.update(card.id, {
        pile: 'discard'
    });

        return card;
    }

    validarJogada(cartaNoTopo) {
        return podeJogar(cartaNoTopo);
    }

    async drawToPlayer(gameId, playerId){
        const card = await CardRepository.findOne({
            where: {
                gameId,
                pile: 'draw'
            }
        });

        if(!card){
            throw new Error("Não a cartas no baralho");
        }

        await CardRepository.update(card.id, {
            pile: 'hand',
            playerId: playerId
        });

        console.log(await CardRepository.findAll())

        return card;
    }

    /**
     * Retorna todas as cartas na mão de um jogador em uma partida específica.
     * Busca apenas as cartas que estão na pilha "hand",
     * ou seja, cartas que o jogador possui atualmente para jogar.
     *
     * @async
     * @method seePlayerCards
     * @memberof CardService
     *
     * @param {number} gameId    - ID da partida
     * @param {number} playerId  - ID do jogador
     *
     * @returns {Promise<Card[]>} Lista de cartas na mão do jogador.
     * Retorna um array vazio caso o jogador não possua cartas.
     */
    async seePlayerCards(gameId, playerId){
        try{
            const cards = await CardRepository.findAll({
                where:{
                    gameId,
                    playerId,
                    pile: "hand"
                },
                raw: true
            })
            console.log("As cartas são: ", cards)
            return Result.of(cards)
        }catch(error){
            return Result.fail(error)
        }
    }

    /**
     * Realiza o descarte de uma carta da mão do jogador na partida.
     * Move a carta para a pilha de descarte, atualiza a carta no topo
     * do descarte no jogo e desvincula a carta do jogador.
     * Todas as operações são realizadas dentro de uma transação,
     * garantindo consistência dos dados em caso de falha.
     *
     * @async
     * @method jogarUmaCarta
     * @memberof CardService
     *
     * @param {number} gameId   - ID da partida
     * @param {number} playerId - ID do jogador que está descartando a carta
     * @param {number} cardId   - ID da carta a ser descartada
     *
     * @returns {Promise<Result>} Retorna um Result de sucesso com os dados da carta descartada,
     * ou um Result de falha nos seguintes cenários:
     * - A carta não pertence ao jogador ou não está em sua mão
     * - Erro durante a atualização do jogo ou da carta no banco de dados
     */
    async jogarUmaCarta(game, playerId, cardId){
        try{
            const card = await CardRepository.findOne({   // Procura pela carta solicitada
                where:{
                    id: cardId,
                    gameId: game.id,
                    playerId,
                    pile: 'hand'
                }
            });
            // A carta não pertence ao jogador ou não existe
            if(!card) return Result.fail(new Error("Carta não pertence ao jogador"));
            // Atualiza as informações da carta
            await CardRepository.update( cardId, { pile: 'discard', playerId: null } );
            return Result.of(card)
        }catch(error){
            await transaction.rollback()
            return Result.fail(error)
        }
    }
}

module.exports = new CardService()