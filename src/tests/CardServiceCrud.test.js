const CardService = require('../services/CardService');
const CardRepository = require('../repositories/CardRepository');

jest.mock('../repositories/CardRepository');

describe('CardService - CRUD Card Operations', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('Create a successful card.', async () => {
            
            const cardData = { color: 'red', value: '5', gameId: 1 };
            const mockCard = { id: 10, ...cardData };

            CardRepository.create.mockResolvedValue(mockCard);

            const result = await CardService.create(cardData);

            expect(CardRepository.create).toHaveBeenCalledWith(cardData);
            expect(result).toEqual(mockCard);
        });
    });

    describe('findAll', () => {
        it('Return all card', async () => {
            const mockCards = [
                { id: 1, color: 'blue', value: '1' },
                { id: 2, color: 'green', value: 'skip' }
            ];
            CardRepository.findAll.mockResolvedValue(mockCards);

            const result = await CardService.findAll();

            expect(result).toEqual(mockCards);
            expect(CardRepository.findAll).toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('return a specific card by ID', async () => {
            const mockCard = { id: 1, color: 'blue', value: '1' };
            CardRepository.findById.mockResolvedValue(mockCard);

            const result = await CardService.findById(1);

            expect(result).toEqual(mockCard);
            expect(CardRepository.findById).toHaveBeenCalledWith(1);
        });

        it('Returns null if the card is not found.', async () => {
            CardRepository.findById.mockResolvedValue(null);

            const result = await CardService.findById(999);

            expect(result).toBeNull();
        });
    });

    describe('update', () => {
        it('Update an existing card successfully.', async () => {
        
            const cardId = 1;
            const updateData = { pile: 'discard' };
            const mockCardOriginal = { id: cardId, color: 'red', value: '5', pile: 'draw' };
            const mockCardAtualizada = { ...mockCardOriginal, ...updateData };

            CardRepository.findById.mockResolvedValue(mockCardOriginal);
            CardRepository.update.mockResolvedValue(mockCardAtualizada);

            const result = await CardService.update(cardId, updateData);

            expect(CardRepository.findById).toHaveBeenCalledWith(cardId);
            expect(CardRepository.update).toHaveBeenCalledWith(mockCardOriginal, updateData);
            expect(result).toEqual(mockCardAtualizada);
        });

        it('Returns null when attempting to update a non-existent card.', async () => {
            CardRepository.findById.mockResolvedValue(null);

            const result = await CardService.update(999, { pile: 'discard' });

            expect(result).toBeNull();
            expect(CardRepository.update).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('You need to delete an existing card.', async () => {
            const cardId = 1;
            const mockCard = { id: cardId, color: 'yellow', value: '9' };

            CardRepository.findById.mockResolvedValue(mockCard);
            CardRepository.delete.mockResolvedValue(true);

            const result = await CardService.delete(cardId);

            expect(CardRepository.findById).toHaveBeenCalledWith(cardId);
            expect(CardRepository.delete).toHaveBeenCalledWith(mockCard);
            expect(result).toBe(true);
        });

        it('Returns null when attempting to delete a non-existent card.', async () => {
            CardRepository.findById.mockResolvedValue(null);

            const result = await CardService.delete(999);

            expect(result).toBeNull();
            expect(CardRepository.delete).not.toHaveBeenCalled();
        });
    });
});