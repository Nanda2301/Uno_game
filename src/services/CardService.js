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
    map: (fn) => CardFunctor(fn(value)),
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

    async findById(id) { 
        const card = await CardRepository.findById(id);
        
        if (!card) return null;

        return CardFunctor(card)
            .map(c => {
                const plainCard = c.get({ plain: true }); 
                return {
                    ...plainCard,
                    nomeExibicao: `${plainCard.color} ${plainCard.value}`,
                    processadoEm: new Date().toISOString()
                };
            })
            .join();
    }

    async findById(id) {
        return await CardRepository.findById(id);
    }

    async update(id, data) {
        const card = await CardRepository.findById(id);
        if (!card) return null;

        return await CardRepository.update(card, data);
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

    await CardRepository.update(card, {
        pile: 'discard'
    });

    return card;
}

    validarJogada(cartaNoTopo) {
        return podeJogar(cartaNoTopo);
    }
}

module.exports = new CardService();