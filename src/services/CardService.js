const CardRepository = require("../repositories/CardRepository");

// ========================================
// 🔥 PROGRAMAÇÃO FUNCIONAL APLICADA
// ========================================

/**
 * 🎯 CURRYING - Validação de jogada de carta
 * Retorna uma função que verifica se uma carta pode ser jogada
 * Uso: const validador = podeJogar(cartaNoTopo);
 *      validador(cartaNaMao) // true ou false
 */
const podeJogar = (cartaNoTopo) => (cartaJogada) => {
    // Cartas pretas sempre podem ser jogadas
    if (cartaJogada.color === 'black') return true;
    
    // Mesma cor ou mesmo valor
    return cartaNoTopo.color === cartaJogada.color || 
           cartaNoTopo.value === cartaJogada.value;
};

/**
 * 🎲 IMUTABILIDADE - Embaralhar deck sem mutar o original
 * Retorna um NOVO array embaralhado usando Fisher-Yates
 */
const embaralhar = (deck) => {
    // Cria uma CÓPIA do array (imutabilidade!)
    const novoArray = [...deck];
    
    for (let i = novoArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]];
    }
    
    return novoArray;
};

/**
 * 🃏 FUNÇÃO PURA - Criar estrutura de uma carta
 * Sempre retorna o mesmo resultado para os mesmos inputs
 */
const criarCarta = (gameId) => (color) => (value) => ({
    gameId,
    color,
    value,
    // Definindo propriedades para cartas especiais
    especial: ['skip', 'reverse', 'draw2', 'wild', 'wild_draw4'].includes(value),
    efeito: obterEfeito(value)
});

/**
 * 🎴 FUNÇÃO PURA - Mapeia efeitos das cartas especiais
 */
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

/**
 * 🎨 HIGHER ORDER FUNCTION - Gera cartas de uma cor
 * Recebe funções como parâmetro e retorna array
 */
const gerarCartasPorCor = (gameId, color) => {
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                    'skip', 'reverse', 'draw2'];
    
    const criarCartaDaCor = criarCarta(gameId)(color);
    
    // map() é uma Higher Order Function!
    return values.flatMap(value => 
        value === '0' 
            ? [criarCartaDaCor(value)] 
            : [criarCartaDaCor(value), criarCartaDaCor(value)]
    );
};

/**
 * 🌑 Gera cartas pretas (wild)
 */
const gerarCartasPretas = (gameId) => {
    const wildCards = ['wild', 'wild_draw4'];
    const criarCartaPreta = criarCarta(gameId)('black');
    
    return wildCards.flatMap(value => 
        Array(4).fill(null).map(() => criarCartaPreta(value))
    );
};

class CardService {

    /**
     * Cria baralho completo de UNO (108 cartas)
     * Usa COMPOSIÇÃO de funções puras
     */
    async createDeck(gameId) {
        const colors = ['red', 'blue', 'green', 'yellow'];
        
        // Composição funcional: combina resultados de funções puras
        const cartasColoridas = colors.flatMap(cor => 
            gerarCartasPorCor(gameId, cor)
        );
        
        const cartasPretas = gerarCartasPretas(gameId);
        
        // Junta tudo e embaralha (imutável!)
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

    /**
     * Expondo a função de validação (currying)
     */
    validarJogada(cartaNoTopo) {
        return podeJogar(cartaNoTopo);
    }
}

module.exports = new CardService();