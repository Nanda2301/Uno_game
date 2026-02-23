const { where } = require("sequelize");
const CardRepository = require("../repositories/CardRepository");


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

const CardFunctor = (value) => ({
    value,
    map: (fn) => (value === null || value === undefined ? CardFunctor(null) : CardFunctor(fn(value))),
    join: () => value
});
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
        return await CardRepository.create(data);
    }

    async findAll() {
        return await CardRepository.findAll();
    }

    async findById(id) {
        try {
            if (!id) return null;
            const card = await CardRepository.findById(id);
        
            // Uso de Functor para transformar o dado sem mutação direta
            return CardFunctor(card)
            .map(c => (c.toJSON ? c.toJSON() : c))
            .map(c => ({
                ...c,
                label: `${c.color.toUpperCase()} - ${c.value}`,
                viewedAt: new Date().toISOString()
            }))
            .join();
        } catch (error) {
            console.error(`Erro ao buscar carta ${id}:`, error);
            throw new Error('Falha na comunicação com o banco de dados');
        }

        
    }

    async update(id, data) {
        const card = await CardRepository.findById(id);
        if (!card) return null;

        return await CardRepository.update(id, data);
    }

    async delete(id) {
        const card = await CardRepository.findById(id);
        if (!card) return null;

        await CardRepository.delete(card);
        return true;
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

        return card;
    }

    /**
     * Veja as cartas na mão de um jogador
     * 
     * @param {number} gameId 
     * @param {number} playerId 
     */
    async seePlayerCards(gameId, playerId){
        const cards = await CardRepository.findAll({
            where:{
                gameId,
                playerId
            }
        })

        console.log("As cartas são: ", cards)

        return cards
    }
}

module.exports = new CardService();