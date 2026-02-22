/**

 * * @param {Object} config - Configuração do cache
 * @param {number} config.max 
 * @param {number} config.maxAge 
 */
const createMemoizationMiddleware = (config) => {
    const MAX_ITEMS = config.max || 50;
    const MAX_AGE = config.maxAge || 30000;

    let cache = []; 
    const limparExpirados = () => {
        const agora = Date.now();
        cache = cache.filter(item => agora <= item.expiresAt);
    };

    return (req, res, next) => {
        if (req.method !== 'GET') {
            return next();
        }

        limparExpirados();
        const cacheKey = `${req.method}:${req.originalUrl}`;
  
        const cacheIndex = cache.findIndex(item => item.key === cacheKey);

        if (cacheIndex !== -1) {
            console.log(`[Cache HIT] Retornando dados em cache para: ${cacheKey}`);
            
            const item = cache[cacheIndex];
            item.lastAccessed = Date.now();
            item.expiresAt = Date.now() + MAX_AGE; 
            
            return res.json(item.data);
        }

        console.log(`[Cache MISS] Processando nova requisição para: ${cacheKey}`);

        const originalJson = res.json.bind(res);

        res.json = (body) => {
            if (cache.some(item => item.key === cacheKey)) {
                return originalJson(body);
            }
            if (cache.length >= MAX_ITEMS) {
                const leastRecentlyUsed = cache.reduce((lru, current) => {
                    return (current.lastAccessed < lru.lastAccessed) ? current : lru;
                });

                cache = cache.filter(item => item.key !== leastRecentlyUsed.key);
                console.log(`[Cache EVICTION] Item removido por LRU: ${leastRecentlyUsed.key}`);
            }

            cache.push({
                key: cacheKey,
                data: body,
                expiresAt: Date.now() + MAX_AGE,
                lastAccessed: Date.now()
            });
            originalJson(body);
        };

        next();
    };
};

module.exports = createMemoizationMiddleware;