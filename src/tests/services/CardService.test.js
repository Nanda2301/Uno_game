const CardService = require('../services/CardService');
const CardRepository = require('../repositories/CardRepository');

jest.mock('../repositories/CardRepository');

describe('CardService - CRUD Card Operations', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('Create a successful card.', async () => {

            const cardData = { color: 'red', value: '5', gameId: 1, pile: 'draw' };
            const mockCard = { id: 10, ...cardData };

            CardRepository.create.mockResolvedValue(mockCard);

            const result = await CardService.create(cardData);

            expect(CardRepository.create).toHaveBeenCalledWith(cardData);

            expect(result.ok).toBe(true);
            expect(result.status).toBe(201);
            expect(result.value).toMatchObject(mockCard);
        });
    });

    describe('findAll', () => {
        it('Return all cards', async () => {

            const mockCards = [
                { id: 1, color: 'blue', value: '1' },
                { id: 2, color: 'green', value: 'skip' }
            ];

            CardRepository.findAll.mockResolvedValue(mockCards);

            const result = await CardService.findAll();

            expect(CardRepository.findAll).toHaveBeenCalled();

            expect(result.ok).toBe(true);
            expect(result.value).toMatchObject(mockCards);
            expect(result.value).toHaveLength(2);
        });
    });

    describe('findById', () => {
        it('return a specific card by ID', async () => {

            const mockCard = { id: 1, color: 'blue', value: '1' };
            CardRepository.findById.mockResolvedValue(mockCard);

            const result = await CardService.findById(1);

            expect(CardRepository.findById).toHaveBeenCalledWith(1);

            expect(result.ok).toBe(true);
            expect(result.value).toMatchObject({
                ...mockCard,
                label: "BLUE - 1"
            });
        });

        it('Return error when card not found', async () => {

            CardRepository.findById.mockResolvedValue(null);

            const result = await CardService.findById(999);

            expect(result.ok).toBe(false);
            expect(result.status).toBe(404);
        });
    });

    describe('update', () => {

        it('Update an existing card successfully.', async () => {

            const cardId = 1;

            const updateData = { pile: 'discard' };

            const mockCardUpdated = {
                id: cardId,
                color: 'red',
                value: '5',
                pile: 'discard'
            };

            CardRepository.update.mockResolvedValue(mockCardUpdated);

            const result = await CardService.update(cardId, updateData);

            expect(CardRepository.update).toHaveBeenCalledWith(cardId, updateData);

            expect(result.ok).toBe(true);
            expect(result.value).toMatchObject(mockCardUpdated);
        });

        it('Returns fail when card does not exist', async () => {

            CardRepository.update.mockResolvedValue(null);

            const result = await CardService.update(999, { pile: 'discard' });

            expect(result.ok).toBe(false);
            expect(result.status).toBe(404);
        });

    });

    describe('delete', () => {

        it('Delete an existing card.', async () => {

            const cardId = 1;
            const mockCard = { id: cardId, color: 'yellow', value: '9' };

            CardRepository.findById.mockResolvedValue(mockCard);
            CardRepository.delete.mockResolvedValue(true);

            const result = await CardService.delete(cardId);

            expect(CardRepository.findById).toHaveBeenCalledWith(cardId);
            expect(CardRepository.delete).toHaveBeenCalledWith(mockCard);

            expect(result.ok).toBe(true);
            expect(result.value).toMatchObject({
                Mensage: "Removido com sucesso"
            });
        });

        it('Returns fail when attempting to delete a non-existent card.', async () => {

            CardRepository.findById.mockResolvedValue(null);

            const result = await CardService.delete(999);

            expect(result.ok).toBe(false);
            expect(result.status).toBe(404);
        });

    });

});

describe('CardService Functor Tests', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should fail safely when ID is undefined', async () => {

        const result = await CardService.findById(undefined);

        expect(result.ok).toBe(false);
        expect(result.status).toBe(400);
    });

    test('Should safely return fail when card does not exist', async () => {

        CardRepository.findById.mockResolvedValue(null);

        const result = await CardService.findById(999);

        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
    });

});